import { globalVanie } from "vanie";

function reCuadro(){
    const div = document.createElement('div');
    const contenedor = div.cloneNode();
    contenedor.classList.add(globalVanie.globalClass('bloqueado'));
    div.appendChild(contenedor);
    return [div,contenedor];}

function insertarA(padre,elemento,num){
    const lista = [];
    for(let i = 0; i < num; i++){
        const e = document.createElement(elemento);
        padre.appendChild(e);
        lista.push(e);}
    return lista;}

function imagen(src){
    const img = new Image;
    img.src=src;
    return img;}

function txt(str){
    const span = document.createElement('span');
    span.innerText = str;
    return span;}

function parrafo(str){
    const p = document.createElement('p');
    p.innerText= str;
    return p;
}

function moldeTitulo(str,data){
    const div = document.createElement('div');
    const texto = txt(str);
    if(data & 1) texto.classList.add(globalVanie.globalClass('bloqueado'));
    if(data & 2) div.classList.add(globalVanie.globalClass('bloqueado'));
    if(data & 4) div.style.width = div.style.height = '100%';
    div.appendChild(texto);
    return div;}

function moldeBoton(url,fn){
    const div = document.createElement('div');
    const ico = new Image;
    const btn = document.createElement('button');
    btn.appendChild(ico);
    if(typeof url == 'string') ico.setAttribute('src',url);
    else if(url instanceof Array){
        ico.setAttribute('src',url[0]);
        btn.appendChild(txt(url[1]));}
    div.appendChild(btn);
    if(fn) btn.addEventListener('click',fn);
    return div;}

function moldeBipanel(full = true){
    const contenedor = document.createElement('div');
    const panelDer = contenedor.cloneNode();
    const panelIzq = contenedor.cloneNode();
    contenedor.appendChild(panelDer);
    contenedor.appendChild(panelIzq);
    if(full)contenedor.style.height = contenedor.style.width = '100%';
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

export {moldeElemento,moldeArchivo,elegirNodo,reCuadro,moldeBipanel,imagen,txt,moldeTitulo,moldeBoton,insertarA,parrafo}