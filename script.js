
const startScreen = document.getElementById('startScreen');
const startRegister = document.getElementById('startRegister');
const appHeader = document.getElementById('appHeader');
const mainApp = document.getElementById('mainApp');

const btnPublicar = document.getElementById("btnPublicar");
const btnReporte = document.getElementById("btnReporte");

const modalRegistro = document.getElementById("modalRegistro");
const modalPublicar = document.getElementById("modalPublicar");
const modalIntercambio = document.getElementById("modalIntercambio");
const modalReporteCuenta = document.getElementById("modalReporteCuenta");

const closeRegistro = document.getElementById("closeRegistro");
const closePublicar = document.getElementById("closePublicar");
const closeModal = document.getElementById("closeModal");
const closeReporteCuenta = document.getElementById("closeReporteCuenta");

const registroForm = document.getElementById("registroForm");
const registroMensaje = document.getElementById("registroMensaje");

const listaArticulos = document.getElementById("listaArticulos");
const prevBtn = document.getElementById("prevArticulo");
const nextBtn = document.getElementById("nextArticulo");


startRegister.addEventListener('click', ()=>{
  modalRegistro.style.display="flex";
});

btnPublicar.addEventListener("click", ()=> modalPublicar.style.display="flex");
btnReporte.addEventListener("click", ()=> modalReporteCuenta.style.display="flex");
closeRegistro.onclick = ()=> modalRegistro.style.display="none";
closePublicar.onclick = ()=> modalPublicar.style.display="none";
closeModal.onclick = ()=> modalIntercambio.style.display="none";
closeReporteCuenta.onclick = ()=> modalReporteCuenta.style.display="none";
window.onclick = (e)=>{
  if([modalRegistro, modalPublicar, modalIntercambio, modalReporteCuenta].includes(e.target)){
    e.target.style.display="none";
  }
}


let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
let usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));

function mostrarUsuarioHeader(usuario){
  const header = document.getElementById("usuarioHeader");
  document.getElementById("nombreHeader").textContent = usuario.username;
  document.getElementById("fotoPerfilHeader").src = usuario.fotoPerfil;
  document.getElementById("fotoPerfilHeader").style.width = "45px";
  document.getElementById("fotoPerfilHeader").style.height = "45px";
  document.getElementById("fotoPerfilHeader").style.borderRadius = "50%";
  document.getElementById("fotoPerfilHeader").style.objectFit = "cover";
  header.style.display = "flex";
  document.querySelector(".menu-buttons").style.display = "flex";

  startScreen.style.display="none";
  appHeader.style.display="flex";
  mainApp.style.display="block";
}

if(usuarioActivo) mostrarUsuarioHeader(usuarioActivo);

registroForm.addEventListener("submit", (e)=>{
  e.preventDefault();
  const username = document.getElementById("username").value.trim();
  const telefono = document.getElementById("telefono").value.trim();
  const password = document.getElementById("password").value;
  const carnet = document.getElementById("carnet").value.trim();
  const fotoPerfilFile = document.getElementById("fotoPerfil").files[0];

  function crearUsuario(fotoPerfil){
    const nuevoUsuario = {username, telefono, password, carnet, fotoPerfil};
    const indexExistente = usuarios.findIndex(u => u.telefono === telefono);
    if(indexExistente !== -1) usuarios[indexExistente] = nuevoUsuario;
    else usuarios.push(nuevoUsuario);

    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    localStorage.setItem("usuarioActivo", JSON.stringify(nuevoUsuario));
    mostrarUsuarioHeader(nuevoUsuario);

    
    registroMensaje.style.color="green";
    registroForm.reset();
    modalRegistro.style.display="none";
    modalPublicar.style.display="flex";
  }

  if(fotoPerfilFile){
    const reader = new FileReader();
    reader.onload = ev=> crearUsuario(ev.target.result);
    reader.readAsDataURL(fotoPerfilFile);
  } else {
    crearUsuario("https://via.placeholder.com/150");
  }
});

document.getElementById("btnCerrarSesion").addEventListener("click", ()=>{
  localStorage.removeItem("usuarioActivo");
  document.getElementById("usuarioHeader").style.display="none";
  startScreen.style.display="flex";
  appHeader.style.display="none";
  mainApp.style.display="none";
});


let articulos = JSON.parse(localStorage.getItem("articulos")) || [];
let articuloSeleccionadoIndex = null;

function mostrarArticulos(){
  listaArticulos.innerHTML="";
  articulos.forEach((a,index)=>{
    const card = document.createElement("div");
    card.classList.add("producto");
    card.innerHTML=`
      <img src="${a.imagen}" alt="${a.titulo}">
      <h3>${a.titulo}</h3>
      <p>${a.descripcion}</p>
      <p><strong>Estado:</strong> ${a.estado}</p>
      <p><strong>Categoría:</strong> ${a.catalogo}</p>
      <button class="btn-intercambio">Intercambiar</button>
    `;
    listaArticulos.appendChild(card);

    card.querySelector(".btn-intercambio").addEventListener("click", ()=>{
      articuloSeleccionadoIndex=index;
      document.getElementById("tituloArticuloIntercambio").value=a.titulo;
      document.getElementById("telefonoIntercambio").value=a.telefono;
      modalIntercambio.style.display="flex";
    });
  });
  actualizarCarrusel();
}

let fotosSeleccionadas=[];
document.getElementById("foto").addEventListener("change",(e)=>{
  const preview = document.getElementById("previewFotos");
  preview.innerHTML="";
  fotosSeleccionadas=[];
  [...e.target.files].forEach(file=>{
    const reader=new FileReader();
    reader.onload=ev=>{
      fotosSeleccionadas.push(ev.target.result);
      const img=document.createElement("img");
      img.src=ev.target.result;
      preview.appendChild(img);
    }
    reader.readAsDataURL(file);
  });
});

document.getElementById("articuloForm").addEventListener("submit",(e)=>{
  e.preventDefault();
  const titulo=document.getElementById("titulo").value;
  const descripcion=document.getElementById("descripcion").value;
  const telefono=document.getElementById("telefonoArticulo").value;
  const estado=document.getElementById("estado").value;
  const catalogo=document.getElementById("catalogo").value;
  const imagen=fotosSeleccionadas[0]||"https://via.placeholder.com/200";

  articulos.push({titulo,descripcion,imagen,telefono,estado,catalogo});
  localStorage.setItem("articulos", JSON.stringify(articulos));
  mostrarArticulos();
  document.getElementById("articuloForm").reset();
  document.getElementById("previewFotos").innerHTML="";
  fotosSeleccionadas=[];
  modalPublicar.style.display="none";
});


document.getElementById("intercambioForm").addEventListener("submit",(e)=>{
  e.preventDefault();
  const nombre=document.getElementById("nombre").value;
  const objeto=document.getElementById("objetoIntercambio").value;
  const mensaje=document.getElementById("mensaje").value;
  const telefonoPropietario=document.getElementById("telefonoIntercambio").value;

  const fecha=new Date();
  const opciones={year:'numeric',month:'long',day:'numeric'};
  const hora=fecha.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});
  const fechaTexto=`${fecha.toLocaleDateString('es-ES',opciones)} a las ${hora}`;

  const textoWhatsApp=`*Solicitud de intercambio desde TRUEQUE ONLINE*

*Nombre:* ${nombre}
*Quiero intercambiar:* ${objeto}
*Mensaje del usuario:* ${mensaje}
*Enviado el:* ${fechaTexto}
*Mensaje generado automáticamente por Trueque Online*`;

  const url=`https://wa.me/${telefonoPropietario}?text=${encodeURIComponent(textoWhatsApp)}`;
  window.open(url,"_blank");

  if(articuloSeleccionadoIndex!==null){
    articulos.splice(articuloSeleccionadoIndex,1);
    localStorage.setItem("articulos", JSON.stringify(articulos));
    mostrarArticulos();
    articuloSeleccionadoIndex=null;
  }

  document.getElementById("intercambioForm").reset();
  modalIntercambio.style.display="none";
});


let fotosReporte=[];
document.getElementById("fotoReporteCuenta").addEventListener("change",(e)=>{
  const preview=document.getElementById("previewReporteCuenta");
  preview.innerHTML="";
  fotosReporte=[];
  [...e.target.files].forEach(file=>{
    const reader=new FileReader();
    reader.onload=ev=>{
      fotosReporte.push(ev.target.result);
      const img=document.createElement("img");
      img.src=ev.target.result;
      preview.appendChild(img);
    }
    reader.readAsDataURL(file);
  });
});

document.getElementById("reporteCuentaForm").addEventListener("submit",(e)=>{
  e.preventDefault();
  const motivo=document.getElementById("motivoReporteCuenta").value;
  const telefono=document.getElementById("telefonoDenunciado").value;
  const reportarCuenta=document.getElementById("reportarCuenta").checked;
  alert(`Reporte enviado:\nMotivo: ${motivo}\nNúmero denunciado: ${telefono}\nReportar cuenta: ${reportarCuenta ? "Sí" : "No"}`);
  document.getElementById("reporteCuentaForm").reset();
  document.getElementById("previewReporteCuenta").innerHTML="";
  fotosReporte=[];
  modalReporteCuenta.style.display="none";
});


let carruselIndex=0;
function actualizarCarrusel(){
  const track=document.getElementById("listaArticulos");
  const itemWidth=track.querySelector(".producto")?.offsetWidth || 260;
  track.style.transform=`translateX(-${carruselIndex*itemWidth}px)`;
}

nextBtn.addEventListener("click",()=>{
  if(carruselIndex<articulos.length-1) carruselIndex++;
  actualizarCarrusel();
});

prevBtn.addEventListener("click",()=>{
  if(carruselIndex>0) carruselIndex--;
  actualizarCarrusel();
});

mostrarArticulos();
