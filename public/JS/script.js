

async function getSmhi() {
    try {
        const response = await fetch("https://opendata-download-metobs.smhi.se/api/version/latest/parameter/1.json");
        const data = await response.json();
        const weatherStations = data.station;
        

        ///////////////////////////////////////////////////////////
        ////////////////////////////////SÖKFUNKTIONEN///////////////
        let searchBtn = document.getElementById("searchInput");
        searchBtn.addEventListener("click", function (e) {
            try {
                e.preventDefault();
                
                let searchValue = document.getElementById("searchInput").value;
                lowerCaseSearchValue = searchValue.toLowerCase();

                let searchResult = weatherStations.find(element => element.name === capitalizeFirstLetter(lowerCaseSearchValue));
                console.log(searchResult.name);
                let searchedLong = getLong(searchResult);
                let searchedLat = getLat(searchResult);
                getTown(searchedLong, searchedLat);

            } catch (error) {
                alert("try again please");
                console.error(error);
            }

        })
////////////////////////////////////////////////////////////
///////////GÖR FÖRSTA BOKSTAV I STRÄNG TILL STOR BOKSTAV
        function capitalizeFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
          }
                  
        
    //////////////////////////////////////////////////////////
    /////////////////PLACERAR ALLA MÄTSTATIONER I EN LISTA////
        let appList = document.getElementById("ulList");
        for(let i = 0; i < weatherStations.length; i++){
            let listItem = document.createElement("li");
            listItem.setAttribute("class", "listClass");
            listItem.innerHTML = weatherStations[i].name;
            let listButton = document.createElement("button");
            listButton.setAttribute("class", "listButton");
            listButton.innerHTML = "Button";
            appList.appendChild(listItem).appendChild(listButton);

            listButton.addEventListener("click", function (e) {

                clickedLongitute = getLong(weatherStations[i]);
                clickedLatitude = getLat(weatherStations[i]);
                console.log(weatherStations[i].name)
                getTown(clickedLongitute, clickedLatitude);


            })

        }
/////////////////////////////////////////////
/////////////////HÄMTAR LONGITUD
        function getLong(townLong) {
            townLong = Math.round(townLong.longitude);
            return townLong;            
        }
//////////////////////////////////////////////
////////////////////////////////////HÄMTAR LATITUD
        function getLat(townLat) {
            townLat = Math.round(townLat.latitude);
            return townLat;
        }
////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////HÄMTAR SPECIFIK MÄTSTATIONS INFO

       
  
      async function getTown(long, lat) {
        try {
          const townResponse = await fetch("https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/geotype/point/lon/" + long + "/lat/" + lat + "/data.json");
          const townData = await townResponse.json();
          console.log(townData);
          
          var nu = townData.timeSeries[0].validTime;
          var nuvarandeTid = nu.slice(11, 13);
          midnatt = 24 - nuvarandeTid;
          
          console.log("Väderprognos för resten av dagen:")
          for (i = 0; i < midnatt; i++) {
              var temp = (townData.timeSeries[i].parameters[1].values[0]);
              var nederbrPrognos = (townData.timeSeries[i].parameters[15].values[0]);
              var mps = (townData.timeSeries[i].parameters[4].values[0]);
              var molnTotal = (townData.timeSeries[i].parameters[7].values[0]);
              var humidity = (townData.timeSeries[i].parameters[5].values[0]);
            console.log("-----Klockan " + nuvarandeTid)
            console.log(temp + "°");
            getRegn();
            console.log(mps + " m/sek");
            getMoln();
            console.log(humidity + "% luftfuktighet");
            console.log(" ");
            nuvarandeTid++;
          }
          
          console.log("Väderprognos för imorgon:" );
          var imorgon = midnatt + 24;
          var u = 0; 
          for (i = midnatt; i < imorgon; i++ ) {
              var temp = (townData.timeSeries[i].parameters[1].values[0]);
              var nederbrPrognos = (townData.timeSeries[i].parameters[15].values[0]);
              var mps = (townData.timeSeries[i].parameters[4].values[0]);
              var molnTotal = (townData.timeSeries[i].parameters[7].values[0]);
              var humidity = (townData.timeSeries[i].parameters[5].values[0]);
            console.log("-----Klockan " + u)
            console.log(temp + "°");
            getRegn();
            console.log(mps + " m/sek");
            getMoln();
            console.log(humidity + "% luftfuktighet");
            console.log(" ");
            u ++;
          }
  
  
          async function getMoln() {
            var molnighet;
            switch (molnTotal) {
              case 0:
                molnighet = "klar himmel";
                break;
              case 1:
                molnighet = "lite moln";
                break;
              case 2:
                molnighet = "lagom mycket moln";
                break;
              case 3:
                molnighet = "lagom mycket moln";
                break;
              case 4:
                molnighet = "hälften moln, hälften himmel";
                break;
              case 5:
                molnighet = "ganska mycket moln";
                break;
              case 6:
                molnighet = "mestadels moln";
                break;
              case 7:
                molnighet = "fullt molntäcke";
                break;
              case 8:
                molnighet = "fullt molntäcke";
            }
            console.log(molnighet);
          }

          async function getRegn() {
            var nederbrd;
            switch (nederbrPrognos) {
              case 0:
                nederbrd = "ingen nederbörd";
                break;
              case 1:
                nederbrd = "snö";
                break;
              case 2:
                nederbrd = "snö och regn";
                break;
              case 3:
                nederbrd = "regn";
                break;
              case 4:
                nederbrd = "duggregn";
                break;
              case 5:
                nederbrd = "fryst regn";
                break;
              case 6:
                nederbrd = "fryst duggregn";
            }
            console.log(nederbrd);
          }
        
          
  
        } catch (error) {
          console.error(error);
        }
      }
  
    } catch (error) {
      console.error(error);
    }
  }
  
  getSmhi();


