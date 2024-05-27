import Vanie from 'vanie';
import Aplicacion from '../Sistema/Aplicacion'
import { moldeBipanel } from '../Data/moldes'

export default class Vbox{
    #app= new Aplicacion(Vbox.comando,'virtual box',this.ico,this);;
    #ventana = new Vanie;

    static get comando(){return 'VBoxManage';}
    get ico(){return './recursos/iconos/vitual box.png';}

    constructor(){}

    #construir(){
        const [contenedor,derecho,izquierdo] = moldeBipanel();
        this.#ventana.lienzo.appendChild(contenedor);
    }

    abrir(){
        if(!this.#app.ventanaUnica)
            this.#app.agregarVentanaUnica(this.#ventana,this.#app.id);
        this.#app.abrir();}
}