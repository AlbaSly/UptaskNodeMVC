import Swal from "sweetalert2";
import axios from "axios";

const deleteProjectBtn = document.querySelector('#eliminar-proyecto');

(() => {
    if (!deleteProjectBtn) return;
    
    deleteProjectBtn.addEventListener('click', (ev) => {
        Swal.fire({
            title: 'Do you want to delete the project?',
            showDenyButton: true,
            confirmButtonText: 'Yes',
            denyButtonText: 'No',
            icon: 'warning'
        })    
        .then(response => {
            if (!response.isConfirmed) return;
            
            const baseUrl = location.origin;
            const projectUrl = ev.target.dataset.projectUrl;
    
            axios.delete(`${baseUrl}/projects/delete/${projectUrl}`)
                .then(({data: {msg}}) => {
                    Swal.fire('Deleted', msg, 'success').then(r => location.href = '/').catch(r => location.href = '/');
                })
                .catch(reason => {
                    Swal.fire('Error', 'The project has not been deleted', 'error');
                });
        })
        .catch(reason => {
    
        });
    });

})();