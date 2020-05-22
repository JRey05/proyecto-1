allowed_codes = [ "hs256" ];


function base64url(source) {
  // Encode in classical base64
  encodedSource = CryptoJS.enc.Base64.stringify(source);
  
  // Remove padding equal characters
  encodedSource = encodedSource.replace(/=+$/, '');
  
  // Replace characters according to base64url specifications
  encodedSource = encodedSource.replace(/\+/g, '-');
  encodedSource = encodedSource.replace(/\//g, '_');
  
  return encodedSource;
}


function create_JWT( header, payload, secret ){

    header = JSON.parse(header);
    payload = JSON.parse(payload);

    if (header.typ != "JWT" || !allowed_codes.includes( header.alg.toLowerCase() ) ){
        return 1;
    }

    coded_header = base64url( CryptoJS.enc.Utf8.parse( JSON.stringify( header ) ) ) ; 
    coded_payload = base64url( CryptoJS.enc.Utf8.parse( JSON.stringify( payload ) ) ) ; 

    concated_jwt =  coded_header + "." + coded_payload ;

    switch (header.alg.toLowerCase()) {

      case "hs256":

          coded_signature = base64url( CryptoJS.HmacSHA256( concated_jwt, secret ) );
          break;
    
    }
    
    return concated_jwt + "." + coded_signature ;
}

function decode_JWT( jwt, secret ) {
   
    // Separar el jwt en un arreglo de 3 strings
    stringy = jwt.split(".");

    // Decodificar Header y Payload
    head = JSON.parse( CryptoJS.enc.Base64.parse( stringy[0] ).toString( CryptoJS.enc.Utf8 ) );
    payload = JSON.parse( CryptoJS.enc.Base64.parse( stringy[1] ).toString( CryptoJS.enc.Utf8 ) );

    if ( head.typ === "JWT" && allowed_codes.includes( head.alg.toLowerCase() ) ){
        switch ( head.alg.toLowerCase() ) {
            case "hs256":
                // Cifrar el mensaje y comprobar si la clave era correcta.
                signature = stringy[0] + "." + stringy[1];
                signature = base64url( CryptoJS.HmacSHA256( signature, secret ) );
                if ( signature === stringy[2] ) {
                    return [0,head,payload,secret];
                } else {
                    return [1]
                }
        }
    }

    if ( head.typ === "JWT" ) {

        // El cifrado no es soportado.
        return [2]

    } else {

        // No se ingreso un JWT valido
        return [3]

    }

}

head =  {"alg": "HS256", "typ": "JWT"};
payload = {"taza": "cafe", "mate":"yerba"};
secret = "thisiswrong"
//console.log( decode_JWT(create_JWT( head, payload, secret ), secret) );


