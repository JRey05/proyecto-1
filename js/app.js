storage = window.localStorage;
//storage.clear();

$(document).ready(function(){
    updateHistorial();
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
            $("#historial").hide();
            $("#clear").hide();
        }
    });
    $('#save').click(function() {
        guardar();
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
    $(".dropdown-item").click(function() {
        completeHeader($(this).text());
    })
    $("#day").click(function(){
      alert("Todavia no funciono ale. LEAVE ME ALONEEEEEEE");
    });
    $("#night").click(function(){
       alert("Todavia no funciono ale. LEAVE ME ALONEEEEEEE");
    });

});

function guardar() {
    jwt = $('#JWT-text').val();
    if ( jwt === create_JWT($.trim($('#header-text').val()), $.trim($('#payload-text').val()), $.trim($('#signature-text').val()))) {
        id = $('#JWT-id').val();
        alg = JSON.parse($.trim($('#header-text').val())).alg;
        store( jwt , id , alg );
        updateHistorial();
    } else {
        //FIXME Mensaje error
    }
}

function completeHeader(alg) {
    $("#header-text").val('{\n\t"alg": "' + alg + '",\n\t "typ": "JWT"\n}');
}

//FIXME
function completar(position, secret ) {
    arr = getObj('arr');
    if( arr == undefined ) {

    } else {
        jwt = decode_JWT( arr[position][0] , secret );
        console.log(secret);
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
        $("#historial").hide();
        $("#clear").hide();
        return;
    } 
    $("#historial").show();
    $("#clear").show();
    div = $("#historial").children().first();
    for( i=0 ; i < 5 ; i++) {
        if ( arr[i] != undefined ) {
            div.children().first().text( arr[i][1] );
            div.show();
            div.children("div").hide()
        } else {
            div.hide();
        }
        div = div.next();
    }
}

function store( jwt , id , alg ) {
    nuevo = [ jwt , id , alg ]
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

