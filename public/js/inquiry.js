function submitInquiry(event, type) {
    event.preventDefault();

    let name, email, phone, message, carModel;

    if (type === 'reparacion') {
        name = document.getElementById('reparacion-name').value;
        email = document.getElementById('reparacion-email').value;
        phone = document.getElementById('reparacion-phone').value;
        message = document.getElementById('reparacion-message').value;
    } else if (type === 'instalacion') {
        name = document.getElementById('instalacion-name').value;
        phone = document.getElementById('instalacion-phone').value;
        carModel = document.getElementById('instalacion-carModel').value;
        message = document.getElementById('instalacion-message').value;
    }

    const inquiryData = {
        type: type,
        name: name,
        email: email || null,
        phone: phone || null,
        message: message,
        carModel: carModel || null
    };

    fetch('/api/inquiries', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(inquiryData),
    })
    .then(response => response.json())
    .then(data => {
        alert('Tu consulta ha sido enviada con éxito. Te contactaremos a la brevedad.');
        event.target.reset(); // Limpiar el formulario
    })
    .catch(error => {
        console.error('Error al enviar la consulta:', error);
        alert('Hubo un error al enviar tu consulta. Por favor, inténtalo de nuevo más tarde.');
    });
}