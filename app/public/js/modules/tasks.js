import Swal from "sweetalert2";
import axios from "axios";
import { updateProgressBar } from "./progressBar.js";

const TASK = document.querySelector('.listado-pendientes');


(() => {
    if (!TASK) return; 
    
    updateProgressBar();

    const url = location.origin;
    const paths = location.href.split('/');
    const projectSlug = paths[paths.length-1];
    
    TASK.addEventListener('click', async (ev) => {    
        const taskId = ev.target.parentElement.parentElement.dataset.taskId;

        if (ev.target.classList.contains('fa-check-circle')) {
            await changeTaskStatus(taskId, ev);
        }   

        if (ev.target.classList.contains('fas')) {
            await deleteTask(taskId, ev);
        }

        updateProgressBar();
    });
    
    async function changeTaskStatus(id, ev) {
        try {
            const {data} = await axios.patch(`${url}/tasks/change-status/${id}`, {
                projectUrl: projectSlug
            });
    
            ev.target.classList.toggle('completo');
            
            Swal.fire('Changed', 'Task Status Changed', 'success');
        } catch (error) {
            Swal.fire('Error', error.response.msg, 'error');
        }
    }

    async function deleteTask(id, ev) {
        const {isConfirmed} = await Swal.fire({
            title: 'Do you want to delete the task?',
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: 'Yes',
            denyButtonText: 'No',
            icon: 'warning'
        });    

        if (!isConfirmed) return;
        
        try {
            const {data} = await axios.post(`${url}/tasks/delete/${id}`, {
                projectUrl: projectSlug
            });
            ev.target.parentElement.parentElement.remove();
    
            Swal.fire('Deleted', data.msg, 'success');
        } catch (error) {
            const {msg} = error.response.data;

            Swal.fire('Error', msg, 'error');
        }
    }
})();