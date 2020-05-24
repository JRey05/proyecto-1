storage = window.localStorage;
//storage.clear();

$(document).ready(function(){
    $('#header-text, #payload-text, #signature-text').on('keyup',function() {
        jwt = create_JWT($.trim($('#header-text').val()), $.trim($('#payload-text').val()), $.trim($('#signature-text').val())) 
        if( jwt != 1 ) {
            $('#JWT-text').val(jwt);
        } else {
            //cambiar color
        }
    });
    $('#clear').click(function() {
        if( confirm('¿Quiere eliminar los JWT almacenados?') ){
            storage.removeItem( 'arr' );
            $("#historial").children().hide();
        }
    });
    $('#save').click(function() {
        jwt = $('#JWT-text').val();
        store( jwt );
        updateHistorial();
    });
    $('#help-p').click(function() {
        $('#help-text').toggle();
    });
    $(".jwts").click(function() {
        $(this).next().toggle();
    })
    $(".clave").on('keypress',function(e) {
        if( e.which == 13 ) {
            completar($(this).attr('id')[3],$(this).val());
        }
    });

});

function completar(position, secret ) {
    arr = getObj('arr');
    if( arr == undefined ) {

    } else {
        jwt = decode_JWT( arr[position] , secret );
        if ( jwt[0] == 0 ) {
        // El jwt era valido.
            $("#header-text").val(JSON.stringify(jwt[1]));
            $("#payload-text").val(JSON.stringify(jwt[2]));
            $("#signature-text").val(JSON.stringify(secret));
            $("#JWT-text").val( arr[position] );
        }
    }
}

function updateHistorial() {
    if ( ( arr = getObj( 'arr' ) ) == undefined ) {
        return;
    }
    div = $("#historial").children().first();
    for( i=0 ; i < 5 ; i++) {
        if ( arr[i] != undefined ) {
            div.children().first().text( "JWT" + i+1 );
            div.show();
            div.children("div").hide()
        } else {
            div.hide();
        }
        div = div.next();
    }
}

function store( nuevo ) {
    if( getObj( 'arr' ) == undefined ){
        arr = [ nuevo ];
        setObj( 'arr' , arr );
    } else {
        historial = getObj( 'arr' );
        newarr = cascada( historial , nuevo , 0 );
        setObj( 'arr' , newarr );
    }
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

updateHistorial();
