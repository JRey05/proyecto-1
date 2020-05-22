storage = window.localStorage;
//storage.clear();

$(document).ready(function(){
    $('#header-text, #payload-text, #signature-text').on('keypress',function(e) {
      if(e.which == 13) {
        jwt = create_JWT($.trim($('#header-text').val()), $.trim($('#payload-text').val()), $.trim($('#signature-text').val())) 
        $('#JWT-text').val(jwt);
        store( jwt );
      }
    });
});

function store( nuevo ) {
    if( getObj( 'arr' ) == undefined ){
        arr = [ nuevo ];
        setObj( 'arr' , arr );
    } else {
        historial = getObj( 'arr' );
        newarr = cascada( historial , nuevo , 0 );
        setObj( 'arr' , newarr );
    }
    console.log(getObj( 'arr' ));
}

function cascada( arreglo , elemento , posicion ) {
    if( arreglo[ posicion ] == undefined ) {
        arreglo[ posicion ] = elemento;
        return arreglo;
    } else {
        old = arreglo[ posicion ];
        arreglo[ posicion ] = elemento;
        if( posicion < 4 ) {
            return cascada( arreglo , old , posicion + 1 );
        } else {
            return arreglo;
        }
    }
}

// Almacenar json en el local storage
function setObj( key , obj ) {
    storage[key] = JSON.stringify( obj );
}

// Obtener json del local storage
function getObj( key ) {
    if( storage[ key ] != undefined ){
      return JSON.parse( storage[key] );
    } else
    {
      return undefined;
    }
}
