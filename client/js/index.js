import { Planeta } from "./Planeta.js";
import { mostrarSpinner, ocultarSpinner } from "./spinner.js";
import { GetAll, DeleteAll, CreateOne, UpdateById, DeleteById } from "./api.js";

const items = [];
let flag = true;

const frm = document.getElementById("form-item");
const btnGuardar = document.getElementById("btnGuardar");
const btnEliminar = document.getElementById("btnEliminar");
const btnEliminarTodo = document.getElementById("btnEliminarTodo");
const btnModificar = document.getElementById("btnModificar");
const filter = document.getElementById('filter');

document.addEventListener("DOMContentLoaded", async () => {
  manejadorTabla();
  btnGuardar.addEventListener("click", manejadorCargarRegistro);
  btnEliminar.addEventListener('click', manejadorEliminarRegistro);
  btnModificar.addEventListener("click", manejadorModificar);
  btnEliminarTodo.addEventListener('click', manejadorEliminarTodo);
  document.addEventListener("click", manejadorClick);
  filter.addEventListener("change", manejadorFilter)
});

async function manejadorTabla(e) {
  limpiarTabla();
  let data = await GetAll();
  console.log(data);
  data.forEach(e => {
    items.push(e);
  });
  const tabla = createTable(items)
  const contenedor = document.getElementById("container-table");
  renderTabla(tabla, contenedor);
  ocultarSpinner();
}


function manejadorEliminarTodo() {
  if (confirm("¿Desea ELIMINAR TODOS los registros?")) {
    try {
      mostrarSpinner()
      DeleteAll().then(response => {
        manejadorTabla();
        actualizarFormulario()
      })

    } catch (error) {
      console.error("Error al eliminar todos los elementos:", error);
    }
    actualizarFormulario();
    document.getElementsByName("id")[0].setAttribute("id", '0');
  }
}


function manejadorEliminarRegistro() {
  if (confirm("¿Desea ELIMINAR el registro seleccionado?")) {
    const idSeleccionado = parseFloat(document.getElementsByName("id")[0].getAttribute("id"));
    mostrarSpinner();
    try {
      DeleteById(idSeleccionado).then(response => {
        manejadorTabla();
        actualizarFormulario()
      })
    } catch (error) {
      console.error("Error al eliminar el registro:", error);
    }
  }
}

function manejadorFilter(e) {
  const table = document.querySelector('.my-table');
  const tbody = table.querySelector('tbody');
  const rows = Array.from(tbody.querySelectorAll('tr'));

  const promedio = rows.reduce((accumulator, row) => {
    const tds = Array.from(row.querySelectorAll('td'));
    const hasDisplayClass = tds.some(td => td.classList.contains('display'));

    if (!hasDisplayClass) {
      const tipoTd = tds.find(td => td.getAttribute('name') === 'tipo');
      if (tipoTd && tipoTd.innerText == e.target.value) {
        const distanciaAlSolTD = tds.find(td => td.getAttribute('name') === 'distanciaAlSol');
        if (distanciaAlSolTD) {
          accumulator.count++;
          accumulator.sum += parseFloat(distanciaAlSolTD.innerText);
        }
      }
    }
    return accumulator;
  }, { sum: 0, count: 0 });
  const result = document.getElementById('result');
  if (promedio.count > 0) {
    const average = promedio.sum / promedio.count;
    result.setAttribute('value', average);
  } else {
    result.setAttribute('value', 'N/A');
  }
}


function manejadorClick(e) {
  if (e.target.matches("td")) {
    const id = parseFloat(e.target.parentNode.dataset.id);
    const registroSeleccionado = items.find(p => p.id === id);
    if (registroSeleccionado) {
      console.log("Registro Seleccionado:", registroSeleccionado);
    } else {
      console.log("No se encontró ningún registro con el ID especificado.");
    }

    e.target.parentNode.classList.toggle("selected");;

    document.getElementsByName("id")[0].setAttribute("id", registroSeleccionado.id);
    document.getElementById("tamano").value = registroSeleccionado.tamano;
    document.getElementById("nombre").value = registroSeleccionado.nombre;
    document.getElementById("masa").value = registroSeleccionado.masa;
    document.getElementById("tipo").value = registroSeleccionado.tipo;
    document.getElementById("distanciaAlSol").value = registroSeleccionado.distanciaAlSol;
    document.getElementById("composicionAtmosferica").value = registroSeleccionado.composicionAtmosferica;

    let presentaVidaElement = document.getElementById("presenciaVida");
    let presentaAnillosElement = document.getElementById("poseeAnillo");

    if (registroSeleccionado['presenciaVida']) {
      presentaVidaElement.checked = true;
    } else {
      presentaVidaElement.checked = false;
    }

    if (registroSeleccionado['poseeAnillo']) {
      presentaAnillosElement.checked = true;
    } else {
      presentaAnillosElement.checked = false;
    }
  }
}

function manejadorCargarRegistro(e) {
  e.preventDefault()
  const nombre = document.getElementById("nombre").value;
  const tamano = document.getElementById("tamano").value;
  const masa = document.getElementById("masa").value;
  const tipo = document.getElementById("tipo").value;
  const distanciaAlSol = document.getElementById("distanciaAlSol").value;
  const composicionAtmosferica = document.getElementById("composicionAtmosferica").value;
  let presenciaVida = document.getElementById("presenciaVida").checked;
  let poseeAnillo = document.getElementById("poseeAnillo").checked;

  console.log(presenciaVida);
  console.log(poseeAnillo);

  if (validarParametros(nombre, tamano, masa, distanciaAlSol, composicionAtmosferica, presenciaVida, poseeAnillo)) {

    const nuevoPlaneta = new Planeta(nombre, tamano, masa, tipo, distanciaAlSol, presenciaVida, poseeAnillo, composicionAtmosferica);
    mostrarSpinner()
    CreateOne(nuevoPlaneta).then(promise => {
      actualizarFormulario()
      manejadorTabla();
    })
  }
  else {
    alert("El registro no paso las validaciones")
  }
}

function manejadorModificar() {
  const idSeleccionado = parseFloat(document.getElementsByName("id")[0].getAttribute("id"));
  const nombre = document.getElementById("nombre").value;
  const tamano = document.getElementById("tamano").value;
  const masa = document.getElementById("masa").value;
  const tipo = document.getElementById("tipo").value;
  const distanciaAlSol = document.getElementById("distanciaAlSol").value;
  const composicionAtmosferica = document.getElementById("composicionAtmosferica").value;
  const presenciaVida = document.getElementById("presenciaVida").checked;
  const poseeAnillo = document.getElementById("poseeAnillo").checked;

  const newData = new Planeta(nombre, tamano, masa, tipo, distanciaAlSol, presenciaVida, poseeAnillo, composicionAtmosferica);

  try {
    mostrarSpinner();
    UpdateById(idSeleccionado, newData)
      .then(response => {
        console.log("Actualización exitosa:", response);
        manejadorTabla();
        actualizarFormulario();
      })
      .catch(error => {
        console.error("Error al guardar los cambios:", error);
      });
  } catch (error) {
    console.error("Error al intentar actualizar:", error);
    ocultarSpinner();
  }
};


function renderTabla(tabla, contenedor) {
  while (contenedor.hasChildNodes()) {
    contenedor.removeChild(contenedor.firstChild)
  }
  if (tabla) {
    contenedor.appendChild(tabla);
  }
}

function createTable(items) {
  const tabla = document.createElement('table');
  tabla.classList.add('my-table');

  if (items.length > 0) {
    tabla.appendChild(createThead(Object.keys(items[0])));
    const tbody = createTbody(items);
    tabla.appendChild(tbody);
  } else {
    const thead = document.createElement('thead');
    const tr = document.createElement('tr');
    const th = document.createElement('th');
    th.textContent = 'No hay elementos disponibles';

    tr.appendChild(th);
    thead.appendChild(tr);
    tabla.appendChild(thead);
  }
  return tabla;
}

function createTbody(items) {
  const tbody = document.createElement("tbody");
  items.forEach((element) => {
    const tr = document.createElement("tr");
    for (const key in element) {
      if (key === 'id') {
        tr.setAttribute("data-id", element[key]);
      } else {
        const td = document.createElement("td");
        td.setAttribute('name', key);
        td.textContent = element[key];
        tr.appendChild(td);
      }
    }
    tbody.appendChild(tr);
  });
  return tbody;
}

function CreateVisibilityCheckBox(key) {

  if (flag) {
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = key;
    const label = document.createElement('label');
    label.innerText = key.toUpperCase();
    const container = document.querySelector('.checkbox-container');
    container.appendChild(label);
    container.appendChild(checkbox);
    checkbox.addEventListener('change', function (event) {
      onChangeCallback(event);
    });
  }
}

function onChangeCallback(e) {

  const table = document.querySelector('.my-table')
  const th = table.querySelectorAll('th');
  const tbody = table.querySelector('tbody');
  const tr = tbody.querySelectorAll('tr');

  th.forEach(element => {
    if (element.name == e.target.id) {
      element.classList.toggle("display");
    }
  });

  tr.forEach(element => {
    const td = element.querySelector(`td[name="${e.target.id}"]`);
    td.classList.toggle("display");
  });
}

function createThead() {
  const thead = document.createElement("thead");
  const tr = document.createElement("tr");

  if (items.length > 0) {
    const keys = Object.keys(items[0]);
    keys.forEach(key => {
      if (key !== 'id') {
        CreateVisibilityCheckBox(key);
        const th = document.createElement("th");
        th.textContent = key;
        th.name = key;
        th.textContent = th.textContent.toUpperCase();
        tr.appendChild(th);
      }
    });
    flag = false;
  } else {
    const th = document.createElement('th');
    th.textContent = 'No hay registros disponibles';
    tr.appendChild(th);
  }

  thead.appendChild(tr);
  return thead;
}

function actualizarFormulario() {
  frm.reset();
}

function validarParametros(nombre, tamano, masa, distanciaAlSol, composicionAtmosferica, presenciaVida, poseeAnillo) {
  return (
    nombre.length > 2 &&
    tamano > 1 &&
    masa > -1 &&
    distanciaAlSol > 0 &&
    presenciaVida !== undefined &&
    poseeAnillo !== undefined &&
    composicionAtmosferica.length > 0
  )
}

function limpiarTabla() {
  items.length = 0;
  const contenedor = document.getElementById("container-table");
  while (contenedor.firstChild) {
    contenedor.removeChild(contenedor.firstChild);
  }
}