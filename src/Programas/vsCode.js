import UrlAplicacion from "../Sistema/UrlAplicacion";
import { ico } from "../Data/iconos";

export default class vsCode{
    #vs;

    static get comando(){return 'code';}
    get ico(){return './recursos/vscode.svg';}

    constructor(){
        this.#vs = new UrlAplicacion(vsCode.comando,'vsCode',this.ico,this);
        this.#vs.app.personalizarCapturas = (id,dimencion)=>{
            const ventana = this.#vs.app.obtenerVentana(id);
            const marco = document.createElement('div');
            const extencion = ventana.titulo.split('.')[1];
            const lenguale = new Image;
            lenguale.src = ico[extencion];
            const img = new Image;
            img.src = './recursos/miniaturas_pref/minivs.webp';
            img.style = marco.style = `width:100%; height:100%;`;
            marco.style.position = 'relative';
            lenguale.style = `height:${dimencion.h/2}px;position:absolute; bottom:0;left:0; aspect-ratio:1;`;
            marco.appendChild(img);
            marco.appendChild(lenguale);
            return marco;}
        this.#vs.configurarVentana(ventana=>{
            ventana.cambiarDimensionInicial('80%','80%');
        })}

    abrir(titulo,url){
        let continuar = true;
        this.#vs.app.forEach(ventana=>{
            if(ventana.titulo == titulo){
                continuar = false;
                ventana.abrir();}});
        if(continuar)
            this.#vs.abrirInstancia(titulo,url);}
}
