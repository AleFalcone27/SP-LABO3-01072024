const ENDPOINT = "http://localhost:3000/planetas";

export function GetAll() {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.addEventListener("readystatechange", function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          const data = JSON.parse(xhr.responseText);
          resolve(data);
        }
        else {
          reject(new Error("ERR " + xhr.status + " :" + xhr.statusText));
        }
      }
    });

    xhr.open("GET", `${ENDPOINT}`);
    xhr.send();
  });
}

export function CreateOne(data) {

  const requestData = {
    id: data.id,
    nombre: data.nombre,
    tamano: data.tamano,
    masa: data.masa,
    tipo: data.tipo,
    distanciaAlSol: data.distanciaAlSol,
    presenciaVida: data.presenciaVida,
    poseeAnillo: data.poseeAnillo,
    composicionAtmosferica: data.composicionAtmosferica
  };

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.addEventListener("readystatechange", function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 201 || xhr.status === 200) { 
          const responseData = JSON.parse(xhr.responseText);
          resolve(responseData);
        } else {
          reject(new Error("ERR " + xhr.status + " :" + xhr.statusText));
        }
      }
    });

    xhr.open("POST", `${ENDPOINT}`);
    xhr.setRequestHeader("Content-Type", "application/json");
    console.log(data);
    xhr.send(JSON.stringify(requestData));
  });
}

export function DeleteAll() {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.addEventListener("readystatechange", function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          resolve("All records have been deleted.");
        } else {
          reject(new Error("ERR " + xhr.status + " :" + xhr.statusText));
        }
      }
    });
    xhr.open("DELETE", `${ENDPOINT}`,);
    xhr.send();
  });
}

export function UpdateById(id, updatedData) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.addEventListener("readystatechange", function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          resolve(JSON.parse(xhr.responseText));
        } else {
          reject(new Error("ERR " + xhr.status + " :" + xhr.statusText));
        }
      }
    });

    xhr.open("PUT", `${ENDPOINT}/${id}`);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(JSON.stringify(updatedData));
  });
}


export function DeleteById(id) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.addEventListener("readystatechange", function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          resolve("Elemento eliminado correctamente.");
        } else if (xhr.status === 404) {
          reject(new Error("Casa no encontrada"));
        } else {
          reject(new Error("ERR " + xhr.status + " :" + xhr.statusText));
        }
      }
    });

    xhr.open("DELETE", `${ENDPOINT}/${id}`);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send();
  });
}