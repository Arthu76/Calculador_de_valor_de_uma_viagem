fetch('./countries.json')
  .then(response => {
    return response.json()
  })
  .then(json => {
    countrJson = json
    countrObj = countrJson.countries
    countries = countrObj.map(x => x.country)
    cities = countrObj.map(x => x.cities)

    var latitudeOrigem = 0
    var longitudeOrigem = 0

    var latitudeDestino = 0
    var longitudeDestino = 0

    let paisOrigem = document.getElementById('paisOrigem')
    let cidadeOrigem = document.getElementById('cidadeOrigem')
    let paisDestino = document.getElementById('paisDestino')
    let cidadeDestino = document.getElementById('cidadeDestino')
    let numAdultos = document.getElementById('numeroAdultos')
    let numCriancas = document.getElementById('numeroCriancas')
    let milhas = document.getElementById('milhas')
    let valorObtidoMilhas = document.getElementById('valorObtidoMilhas')
    let economica = document.getElementById('classeEconomica')
    let executiva = document.getElementById('classeExecutiva')
    let distancia = document.getElementById('distancia')
    let total = document.getElementById('total')

    let origem = document.getElementById('origem')
    let destino = document.getElementById('destino')
    let criancas = document.getElementById('criancas')
    let valorMilhas = document.getElementById('valorMilhas')
    let tipoDeViagem = document.getElementById('tipoDeViagem')

    var valorAdultos = 0
    var valorCriancas = 0
    var listaCidades = []
    var totalValorEconomica = 0

    function criarPais(contries) {
      function selecionarPais(label) {
        for (let i = 0; i < contries.length; i++) {
          let opcoes = document.createElement('option')
          opcoes.innerHTML = contries[i]
          label.appendChild(opcoes)
        }
      }
      selecionarPais(paisOrigem)
      selecionarPais(paisDestino)

      function adicionarEventListener(ouvinte, label, valorFinal, tipo) {
        ouvinte.addEventListener('change', event => {
          let paisSelecionado = event.target.value
          listaCidades = countrObj.find(
            element => element.country == paisSelecionado
          ).cities

          for (let i = label.options.length; i >= 0; i--) {
            // console.log(label)
            label.remove(i)
          }

          console.log(listaCidades)
          for (let i = 0; i < listaCidades.length; i++) {
            let opcoes = document.createElement('option')
            opcoes.innerHTML = listaCidades[i].city

            label.appendChild(opcoes)

            let valorAtual = label.value
            valorFinal.innerHTML = valorAtual

            // valorAtual = this.value
            // valorFinal.innerHTML = valorAtual

            setDataCidade(label, tipo)
            label.onchange = function () {
              setDataCidade(label, tipo)
            }
          }
        })
      }

      function setDataCidade(label, tipo) {
        let latitude = listaCidades.find(
          element => element.city == label.value
        ).latitude

        let longitude = listaCidades.find(
          element => element.city == label.value
        ).longitude

        console.log('latitude- ', latitude, 'longitude- ', longitude)

        if (tipo == 'origem') {
          longitudeOrigem = longitude
          latitudeOrigem = latitude
        }

        if (tipo == 'destino') {
          longitudeDestino = longitude
          latitudeDestino = latitude
          getDistance(
            latitudeOrigem,
            longitudeOrigem,
            latitudeDestino,
            longitudeDestino
          )
        }
      }

      adicionarEventListener(paisOrigem, cidadeOrigem, origem, 'origem')
      adicionarEventListener(paisDestino, cidadeDestino, destino, 'destino')

      function degreesToRadians(degrees) {
        var pi = Math.PI
        return degrees * (pi / 180)
      }

      function getDistance(
        originLatitude,
        originLongitude,
        destinationLatitude,
        destinationLongitude
      ) {
        const EARTH_RADIUS = 6_371.071 // Earth
        const diffLatitudeRadians = degreesToRadians(
          destinationLatitude - originLatitude
        )
        const diffLongitudeRadians = degreesToRadians(
          destinationLongitude - originLongitude
        )
        const originLatitudeRadians = degreesToRadians(originLatitude)
        const destinationLatitudeRadians = degreesToRadians(destinationLatitude)
        const kmDistance =
          2 *
          EARTH_RADIUS *
          Math.asin(
            Math.sqrt(
              Math.sin(diffLatitudeRadians / 2) *
                Math.sin(diffLatitudeRadians / 2) +
                Math.cos(originLatitudeRadians) *
                  Math.cos(destinationLatitudeRadians) *
                  Math.sin(diffLongitudeRadians / 2) *
                  Math.sin(diffLongitudeRadians / 2)
            )
          )
        distancia.innerHTML = kmDistance
        if (paisOrigem.innerHTML == paisDestino.innerHTML) {
          valorAdultos = (kmDistance * 0.3).toFixed(2)
          valorCriancas = (kmDistance * 0.15).toFixed(2)
          valorTotal(numAdultos)
          valorTotal(numCriancas)
        } else if ((paisOrigem.innerHTML = !paisDestino.innerHTML)) {
          valorAdultos = (kmDistance * 0.5).toFixed(2)
          valorCriancas = (kmDistance * 0.25).toFixed(2)
          valorTotal(numAdultos)
          valorTotal(numCriancas)
        }
      }

      function valorTotal(pessoa) {
        pessoa.addEventListener('change', event => {
          quantidadeAdultos = valorAdultos * numAdultos.value
          quantidadeCriancas = valorCriancas * numCriancas.value
          totalValorEconomica = quantidadeAdultos + quantidadeCriancas
          total.innerHTML = totalValorEconomica
        })
      }

      milhas.addEventListener('change', event => {
        valorMilhas.innerHTML = milhas.value
        valorObtidoMilhas.innerHTML = (parseInt(milhas.value) * 0.025).toFixed(
          2
        )
        console.log(parseInt(milhas.value) * 0.025)
      })

      function numPessoas(target, pessoas) {
        target.addEventListener('change', valor => {
          valor = target.value
          pessoas.innerHTML = valor
        })
      }

      function estaChecked(tipoViagem) {
        tipoViagem.addEventListener('change', event => {
          if (economica.checked == true) {
            tipoDeViagem.innerHTML = 'Economica'
            total.innerHTML = totalValorEconomica
          } else if (executiva.checked == true) {
            tipoDeViagem.innerHTML = 'Executiva'
            let adultosEx = valorAdultos * parseFloat(adultos.innerHTML) * 1.8
            let criancaEx = valorCriancas * parseFloat(criancas.innerHTML) * 1.4
            let totalEx = adultosEx + criancaEx
            total.innerHTML = totalEx
          }
        })
      }

      estaChecked(economica)
      estaChecked(executiva)

      numPessoas(numAdultos, adultos)
      numPessoas(numCriancas, criancas)
    }

    criarPais(countries)
  })
