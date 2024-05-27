import kernel from "./src/Sistema/Kernel";
import Menu from "./src/Programas/Menu";
import Folder from "./src/Programas/Folder";
import vsCode from "./src/Programas/vsCode";
import Vbox from "./src/Programas/Vbox";
import cargarFicheros from "./src/Sistema/Ficheros";

window.addEventListener('load',()=>{
    kernel.escritorio('escritorio').SistemaOperativo('mac').dock('dock').protectorPantalla('protector');
    new Menu;
    new Folder;
    new vsCode;
    new Vbox;
    cargarFicheros();
});