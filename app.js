///Id donde irán nuestras Cards
const cards = document.getElementById('cards');
///En este caso los items seran los elementos del carrito
const items = document.getElementById('items');
///Con este id vamos a mostrar el total
const footer = document.getElementById('footer');
///Id donde va nuestro template en el Card
///.content para acceder a los elementos internos del div
const templateCard = document.getElementById('template-card').content;
///Aca mostraremos el pie de la tabla donde se mostrara el total de productos
const templateFooter = document.getElementById('template-footer').content;
///Accedemos a la etiqueta padre (template) donde está construido el HTML donde vamos almacenar los datos seleccionados
///a la hora de dar click
const templateCarrito = document.getElementById('template-carrito').content;
///Usaremos el fragment
const fragment = document.createDocumentFragment();
///Vamos a crear un objeto que sera nuestro carrito para contener más objetos
///Es practicamente nuestra colección que se verá reflejada a la hora de dar click 
///Al boton de comprar
let carrito = {};

///////Tenemos un addEventListener que va esperar que se lea todo nuestro HTML y va ejecutar algunas funciones/////////////////
///DOMContentLoaded: se dispara cuando el documento HTML ha sido completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    fectchData();
});

///En cards tenemos cada Card y es con está función que vamos
///a detectar cada vez que se de click en elementos internos de él
cards.addEventListener('click', e => {
    addCarrito(e);
})

items.addEventListener('click', e => {
    ///Este metodo nos servira para los botones de aumentar o disminuir la cantidad del producto
    btnAccion(e);
})


///Accederemos a las imagenes usando fetch
const fectchData = async () => {
    try{
        const res = await fetch('api.json');
        const data = await res.json();
        ///Aca ejecutamos nuestra función la cual pintara los datos del api.json en nuestro card
        pintarCards(data);
        ///console.log(data);
    }catch(error){
    console.log(error);
    }
};

///Pintaremos la información del Card
///En este caso recibira la data, ya que alli tenemos nuestros objetos, entre ellos las imagenes
const pintarCards = data => {
    ///console.log(data);
    ///En este caso podemos usar forEach ya que se puede para recorrer JSON, pero con objetos se hace de manera diferente
    ///Practicamente aqui estamos modificando los elementos internos de nuestra card
    data.forEach(producto => {
        ///Accedemos directamente a la etiqueta ya que no hay más y dentro de ella
        ///vamos a modificar su contenido agregando el títle de nuestros objetos del archivo api.json
        templateCard.querySelector('h5').textContent = producto.title;
        ///Modificaremos ahora el precio
        templateCard.querySelector('p').textContent = producto.precio;
        ///Accederemos a la imagen
        ///setAttribute: establece el valor de un atributo ene el elemento indicado
        ///Parametros: nombre, valor
        templateCard.querySelector('img').setAttribute('src', producto.thumbnailUrl);
        ///Accederemos al boton que esta dentro de nuestro template
        ///Con el accederemos al id de nuestros objetos en nuestro archivo api.json
        ///Esto para vincular cada boton con el id de nuestros objetos
        templateCard.querySelector('.btn-dark').dataset.id = producto.id;
        ///La clonación es necesaria
        const clone = templateCard.cloneNode(true);
        fragment.appendChild(clone);
    });
    ///Acá practicamente le estamos mandando los datos correspondientes el archivo api.json al cards que es donde se visualizaran dichas cards
    cards.appendChild(fragment);
}
///"e" parametro que servira para capturar un evento
///Practicamente esta función solo detectara cuando se de click al boton comprar y la 
///logica la implementara la función que está detnro llamada setCarrito
const addCarrito = (e) => {
    ///console.log(e.target);
    ///Si nuestro parametro dentro de el tiene alguna etiqueta, en este caso la clase coincide con el boton comprar
    ///Hija que contenga la clase 
    if(e.target.classList.contains('btn-dark')){
        ///console.log(e.target.parentElement);
        ///Aunque damos click al boton comprar, pero accedemos a todos los elementos
        ///desde el div y esto nos ayudara que a la hora de dar clcick al boton comprar, almacenemos los datos como sería el producto
        ///precio, etc
        ///El metodo setCarrito recibira toda la data que viene a la hora de dar click al boton comprar
        ///Practicamente con el e.target.parentElement estamos capturando a la hora de dar click al boton comprar, todas las etiquetas
        ///desde la etiqueta div que es la padre
        setCarrito(e.target.parentElement);
    }
    e.stopPropagation();
} 

///Con esta función vamos a manipular nuestro carrito
///Como sería agregar los elementos
const setCarrito = objeto => {
    console.log(objeto);
    ///Ya que hemos recorrido las propiedades de nuestro objeto api.json
    ///En este caso vamos a capturar el id correspondiente a la imagen que hemos dado click
    ///Practicamente aqui, como ya capturamos anteriormente lo seleccionado en nuestra card con el metodo addCarrito
    ///Entonces con la ayuda de la creación de un nuevo objeto nos ayudara para mostrar en pantalla los datos seleccionados
    const producto = {
        id: objeto.querySelector('.btn-dark').dataset.id,
        title: objeto.querySelector('h5').textContent,
        precio: objeto.querySelector('p').textContent,
        ///Esta propiedad servira para aumentar o decrementar la cantidad del producto
        cantidad: 1
    }
    ///Vamos a manejar la logica de la cantidad
    ///Con esto indicamos si el producto existe y para verificarlo lo haremos con el id
    ///Y esto nos sirve para saber si se ha duplicado y lo unico que hara es aumentar la cantidad
    ///Aca vamos a detectar si un producto se está duplicando, si es asi vamos a aumentar la cantidad, y esto lo vamos identificar si el id está repetido
    ///hasOwnProperty: método devuelve un valor booleano que indica si el objeto tiene la propiedad especificada como propiedad propia
if(carrito.hasOwnProperty(producto.id)){
    ///Accedemos al indice de nuestro objeto con producto.id y aumentamos la cantidad
    ///Practicamente a nuestra propiedad cantidad le vamos asignar
    ///a la suma de la cantidad almacenada ya en el objeto carrito
    producto.cantidad = carrito[producto.id].cantidad + 1;
}
///Acá vamos agregar a nuestro objeto carrito todas las propiedades
///que vienen ya capturadas de nuestro objeto producto
///... Indica que sera una copia del objeto producto
carrito[producto.id] = {...producto}
///Por el momento lo que hemos hecho es pasar los datos correspondientes de nuestra card a un nuevo objeto
///Ahora solo falta pintarlo en pantalla
pintarCarrito();
}
///Aca lo pintaremos en pantalla
const pintarCarrito = () => {
    ///console.log(carrito);
    ///Tenemos que vaciar items ya que por ejemplo si seleccionamos el objeto en el carrito con el id 3
    ///lo que pasaria seria que va recorrer desde el id 1 hasta el 3 y aparecerean seleccionados cuando solo seleccionamos el 3
    items.innerHTML = '';
    ///De esta forma recorremos un objeto con forEach
    Object.values(carrito).forEach(producto => {
        templateCarrito.querySelector('th').textContent = producto.id;
        ///De esta forma podemos acceder a la primer etiqueta td en nuestro doc HTML
        templateCarrito.querySelectorAll('td')[0].textContent = producto.title;
        templateCarrito.querySelectorAll('td')[1].textContent = producto.cantidad;
        ///De esta forma se accede a un id
        templateCarrito.querySelector('.btn-info').dataset.id = producto.id;
        templateCarrito.querySelector('.btn-danger').dataset.id = producto.id;
        templateCarrito.querySelector('span').textContent = producto.cantidad * producto.precio;

        const clone = templateCarrito.cloneNode(true);
        fragment.appendChild(clone);
    });
    items.appendChild(fragment);

    pintarFooter();
}

///Ahora vamos agregar el pie de nuestra tabla donde mostraremos el total
const pintarFooter = () =>{
    footer.innerHTML = '';
    ///Si dentro de nuestra tabla si es igual a cero quiere decir que no hay datos seleccionados
    if(Object.keys(carrito).length === 0){
        footer.innerHTML = `<th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>`;

        ///Con este return nos servira en el caso que el carrito este vacio
        ///no ejecute lo que esta debajo del if, esto nos servira por si apretamos el boton vaciar
        return;
    }
    ///Estaa sera la suma de todas las cantidades
    ///acc sera el acumulador de las cantidades
    ///Vamos a retornar un numero y ,0 es una forma de hacerlo
    ///Lo que va entre '{}' son las prppiedades del objeto
   const nCantidad = Object.values(carrito).reduce((acc, {cantidad}) => acc + cantidad,0);
   ///Con esto vamos a mostrar el total del precio
   const nPrecio = Object.values(carrito).reduce((acc, {cantidad, precio}) => acc + cantidad * precio, 0);
   templateFooter.querySelectorAll('td')[0].textContent = nCantidad;
   templateFooter.querySelector('span').textContent = nPrecio;
   const clone = templateFooter.cloneNode(true);
   fragment.appendChild(clone);
   ///console.log(nPrecio);
   footer.appendChild(fragment);
   ///En este caso en el footer vamos acceder directamente al boton de vaciar
   ///Con el id="vaciar-carrito"
   const btnVciar = document.getElementById('vaciar-carrito');
   btnVciar.addEventListener('click', () => {
    carrito = {};
    ///Hay que volver a llamar el metodo pintarCarrito
    ///Ya que alli se crea el objeto producto y se lo pasamos al carrito
    ///pero esta vez ya va vacio
    pintarCarrito();
   })
}

const btnAccion = (e) => {
    ///console.log(e.target);
    ///Boton de aumentar (accion aumentar)
    if(e.target.classList.contains('btn-info')){
        ///console.log(carrito[e.target.dataset.id]);
        ///producto vendria siendo como una variable temporal para poder incremetar la cantidad y luego pasar la copia de lo almacenado al objeto
        ///carrito
        const producto = carrito[e.target.dataset.id];
        ///producto.cantidad = carrito[e.target.dataset.id].cantidad + 1;
        producto.cantidad++;
        carrito[e.target.dataset.id] = {...producto};
        pintarCarrito();
    }
    if(e.target.classList.contains('btn-danger')){
        ///console.log(carrito[e.target.dataset.id]);
        const producto = carrito[e.target.dataset.id];
        ///producto.cantidad = carrito[e.target.dataset.id].cantidad + 1;
        producto.cantidad--;
        carrito[e.target.dataset.id] = {...producto};
        pintarCarrito();

        if(producto.cantidad === 0){
            ///Con delete eliminamos objetos
            delete carrito[e.target.dataset.id];
        }
        pintarCarrito();
    }
    
    e.stopPropagation();
}