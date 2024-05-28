import Dock from "./Dock";
import { globalVanie } from "vanie";
import kernel from "./Kernel";

export default class DockMac extends Dock{
    #indiceActual = 0;
    #medidaLanzador;
    
    constructor(padre,configuracion){
        super(padre,configuracion);
        this.#medidaLanzador = configuracion.medidaLanzador;
        this.#estilos();
        this.restaurar = this.restaurar.bind(this);
        this.#eventos();}

    #estilos(){this.contenedor.classList.add('dock_mac','acrilico');}

    #eventoBusquedaIndice(){
        if(!this.estaConstruido) return;
        const listaHijos = super.nodos;

        this.contenedor.addEventListener('mouseenter',e=>{
            if(!listaHijos?.length) return;
            kernel.bloquearEscritorio(true);
            this.zIndex = globalVanie.ventanasVisibles + 2;

            const data = {mov: e.offsetX, tam:listaHijos.length * this.contenedor.lastChild.offsetWidth}

            this.#indiceActual = ~~((((data.mov * listaHijos.length)) / data.tam))|0;

            if(this.#indiceActual >=  listaHijos.length) 
                this.#indiceActual = listaHijos.length - 1;});}

    #eventos(){
        this.#eventoBusquedaIndice();

        //ANIMACION AUMENTO
        this.contenedor.addEventListener('mousemove',e =>{
            this.#afirmarIndice(e);
            if(super.nodos[this.#indiceActual]?.getBoundingClientRect().top < e.clientY)
                this.#efectoLupa(e);});

        //VOLVER A SU ESTADO NORMAL
        this.contenedor.addEventListener('mouseleave',this.restaurar);}

    #afirmarIndice(e){
        const contendorActual = super.nodos[this.#indiceActual];

            //if(!this.orientacion || !contendorActual) return;
            if(!contendorActual) return;

            const data = {mov: e.clientX, pos:contendorActual.getBoundingClientRect().left,tam: contendorActual.offsetWidth}

            const inicio = data.pos;
            const fin = inicio + data.tam;

            if(data.mov > fin){
                this.#indiceActual = (this.#indiceActual + 1) >= contendorActual.length ? 
                    contendorActual.length - 1 : this.#indiceActual + 1;}

            if (data.mov < inicio){
                this.#indiceActual = (this.#indiceActual - 1) < 0 ? 0: this.#indiceActual - 1;}}    

    #efectoLupa(e){
        if(this.#indiceActual == undefined || !this.estaActiva || !e) return;
        const posX = e.clientX;

        const redimencionar = (div)=>{
            if(!div) return;
            const media = div.getBoundingClientRect().left + (div.offsetWidth/2);
            const diferencia = (posX < media)? posX/media: media/posX;
            const dimencionParcial = Math.pow(diferencia,2) * this.#medidaLanzador;
            const dimencionFinal = dimencionParcial * 2;
            div.style.width =`${dimencionFinal < this.#medidaLanzador ? this.#medidaLanzador: dimencionFinal}px`;}

        requestAnimationFrame(()=>{
            
            redimencionar(super.nodos[this.#indiceActual]);

            const limite = 3
            for(let i = 1; i < limite; ++i){
                redimencionar(super.nodos[this.#indiceActual + i]);
                redimencionar(super.nodos[this.#indiceActual - i]);}
            for(let d = this.#indiceActual + limite; d < super.nodos.length; ++d)
                super.nodos[d].style.width = `${this.#medidaLanzador}px`
            for(let t = this.#indiceActual - limite; t >= 0; --t)
                super.nodos[t].style.width = `${this.#medidaLanzador}px`});}

    desactivar(){this.restaurar();}
    activar(e){this.#efectoLupa(e);}
    interruptor(e){this.#efectoLupa(e);}

    restaurar(){
        kernel.bloquearEscritorio(false);
        this.nodos.forEach(div=>
            {div.style.width = `${this.#medidaLanzador}px`});}}