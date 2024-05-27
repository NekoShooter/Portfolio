import kernel from "./Kernel";
const ESTADO = {error:0,ok:1,vacio:2,abierto:4}
export { ESTADO }

export default class Ruta{
    #origen;
    #rutaActual;
    #historial=[];
    #nav=[];
    #contenido=[];
    #alias;
    
    constructor(str,alias){
        this.borrarHistorial();
        if(str) this.#origen = str;
        this.#alias = alias;}

    get copia(){
        const copia = new Ruta(this.#origen,this.#alias);
        copia.remplazarContenido(this.#contenido);
        return copia;}

    get alias(){return this.#alias}
    get raiz(){return this;}
    get rutaActual(){return this.#rutaActual;}
    get direccionOrigen(){return this.#rutaActual.#origen;}
    get contenido(){return this.#rutaActual.#contenido;}
    get historial(){return this.#rutaActual.#historial;}
    get hayContenido(){return !!this.contenido.length;}
    get pwd(){return this.#nav;}

    ordenar(){this.#contenido.sort((a, b) => a.nombre.localeCompare(b.nombre));}

    remplazarContenido(contenido){
        if(contenido instanceof Array){
            contenido.forEach(elemento=>{
                this.#contenido.push({nombre:elemento.nombre,data:elemento.data})
            });}
        this.#estado();}

    forEach(fn){
        if(typeof fn != 'function') return;
        for(let i = 0; i < this.#rutaActual.#contenido.length; ++i){
            const elemento = this.#rutaActual.#contenido[i]
            const tipo = (elemento.data instanceof Ruta) ? 1 : 2;
            fn(elemento,tipo,i);}}

    agregarRuta(pwd){
        if(pwd instanceof Ruta){this.#contenido.push({nombre:pwd.direccionOrigen,data:pwd});}}

    agregarArchivos(archivos){
        if(!(archivos instanceof Array)) return;
        archivos.forEach(contenido=>{this.nuevoArchivo(...contenido)});}

    nuevoArchivo(nombreArchivo,comando,data){
        this.#contenido.push({nombre:nombreArchivo,data:[comando,data]});}

    borrarHistorial(){
        this.#rutaActual = this;
        this.#nav = [this.#origen];
        this.#historial = [this];
        return this.#estado();}

    regresar(){
        this.#rutaActual = this.#historial[this.#historial.length - 1];
        if(this.#historial.length!=1){
            this.#nav.pop();
            this.#historial.pop();}
        return this.#estado();}

    #registrar(ruta){
        this.#rutaActual = ruta;
        this.#historial.push(ruta);
        this.#nav.push(ruta.direccionOrigen);
        return this.#estado();}

    #estado(){return this.#rutaActual.hayContenido?ESTADO.ok:ESTADO.vacio;}

    cd(cd){
        if(cd == '..') return this.regresar();
        const cdActual = this.#rutaActual;
        
        if(!cdActual.hayContenido) return ESTADO.vacio;

        if(typeof cd == 'string'){
            for(let i = 0; i < cdActual.contenido.length; ++i){
                if(cdActual.contenido[i].nombre == cd){
                    cd = i; break;}}}

        if(typeof cd == 'number'){
            const contenido = cdActual.contenido[cd];

            if(contenido?.data instanceof Ruta)return this.#registrar(contenido.data);
            else if(contenido?.data instanceof Array){
                const app = kernel.aplicacion(contenido.data[0]);
                if(!app) return ESTADO.error;
                app.abrir(contenido.nombre,contenido.data[1]);
                return ESTADO.abierto;}}
        return ESTADO.error;}}