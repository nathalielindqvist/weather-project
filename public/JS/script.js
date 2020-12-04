

async function getSmhi() {
    try {
        const response = await fetch("https://opendata-download-metobs.smhi.se/api/version/latest/parameter/1.json");
        const data = await response.json();
        const weatherStations = data.station;
        

        ///////////////////////////////////////////////////////////
        ////////////////////////////////SÖKFUNKTIONEN///////////////
        let searchBtn = document.getElementById("searchBtn");
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
                console.log(townData.timeSeries[2].parameters[11].values);

            } catch (error) {
                console.error(error);
            }
        }

    } catch (error) {
        console.error(error);
    }
}

getSmhi();


