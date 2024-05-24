import { globalVanie } from "vanie";

function reCuadro(){
    const div = document.createElement('div');
    const contenedor = div.cloneNode();
    contenedor.classList.add(globalVanie.globalClass('bloqueado'));
    div.appendChild(contenedor);
    return [div,contenedor];}

function imagen(src){
    const img = new Image;
    img.src=src;
    return img;}

function txt(str){
    const span = document.createElement('span');
    span.innerText = str;
    return span;}

function moldeBipanel(){
    const contenedor = document.createElement('div');
    const panelDer = contenedor.cloneNode();
    const panelIzq = contenedor.cloneNode();
    contenedor.appendChild(panelDer);
    contenedor.appendChild(panelIzq);
    contenedor.style.height = contenedor.style.widht = '100%';
    return [contenedor,panelDer,panelIzq];}

function moldeElemento(url,str){
    const [div,contenedor] = reCuadro();
    contenedor.appendChild(imagen(url));
    contenedor.appendChild(txt(str));
    return div;}

function moldeArchivo(imgP,imgS,str){
    const [div,contenedor] = reCuadro();
    const marco = contenedor.cloneNode();
    marco.appendChild(imagen(imgP));
    marco.appendChild(imagen(imgS));
    contenedor.appendChild(marco);
    contenedor.appendChild(txt(str));
    return div;}

function elegirNodo(e,elemento,fn){
    if(e.target === elemento) return;
    const div = elemento.childNodes;
    for(let i = 0; i < div.length; i++){
        if(div[i] === e.target){
            fn(i,div[i]);
            break;}}}

export {moldeElemento,moldeArchivo,elegirNodo,reCuadro,moldeBipanel,imagen,txt}