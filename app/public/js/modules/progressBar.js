const calcPercentage = (total, progress) => {   
    return (progress * 100) / total;
}

export const updateProgressBar = () => {
    const tasks = document.querySelectorAll('li.tarea');
    const completedTasks = document.querySelectorAll('li.tarea .acciones .completo');

    const percentageBar = document.querySelector('#porcentaje');
    const progressText = document.querySelector('#progreso');

    const percentage = calcPercentage(tasks.length, completedTasks.length) || 0;

    percentageBar.style.width = percentage + '%';
    progressText.textContent = `${parseFloat(percentage).toFixed(2)}%`
}