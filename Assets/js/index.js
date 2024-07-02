const inputmoneda = document.getElementById('inputmoneda');
const selectmoneda = document.getElementById('selectmoneda');
const conversionbtn = document.getElementById('resultbtn');
const totalconversion = document.getElementById('resultadotext');
const grafx = document.getElementById('grafico').getContext('2d');
let grafico;

conversionbtn.addEventListener('click', async function() {
    const amount = parseFloat(inputmoneda.value);
    if (!amount || isNaN(amount)) {
        alert('Por favor ingresa un valor numérico válido.');
        return;
    }

    const convertirA = selectmoneda.value;
  
    try {
      const res = await fetch(`https://mindicador.cl/api/${convertirA.toLowerCase()}`);
      const data = await res.json();
      
      if (data.serie && data.serie.length > 0) {
        const conversionRate = data.serie[0].valor;
        const result = amount / conversionRate;
  
        totalconversion.textContent = `${amount} CLP = ${result.toFixed(2)} ${convertirA}`;

        const historicalDataRes = await fetch(`https://mindicador.cl/api/${convertirA.toLowerCase()}/`);
        const historicalData = await historicalDataRes.json();

        const labels = historicalData.serie.map(entry => entry.fecha);
        const values = historicalData.serie.map(entry => entry.valor);

        if (grafico) {
            grafico.destroy();
        }

        grafico = new Chart(grafx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: `Valor de 1 ${convertirA} en CLP`,
                    data: values,
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.3
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
     } else {
        throw new Error('No se pudo obtener la tasa de conversión.');
      }
    } catch (e) {
      alert('Error al obtener la tasa de conversión. Por favor, intenta de nuevo más tarde.');
      console.error(e);
    }
  });

