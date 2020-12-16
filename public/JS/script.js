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
                let searchedLong = getLong(searchResult);
                let searchedLat = getLat(searchResult);

                var tags = document.getElementsByTagName("h3");
                for (tag of tags) {
                    tag.innerHTML = searchResult.name;
                }
                
                getTown(searchedLong, searchedLat);
                clearPresent();
                
            } catch (error) {
                alert("Prova med en annan stavning.");
                console.error(error);
            }

        })

        //////////////////////////////////////////////////////////
        /////////////////PLACERAR ALLA MÄTSTATIONER I EN LISTA////
        let appList = document.getElementById("ulList");
        for (let i = 0; i < weatherStations.length; i++) {
            let listItem = document.createElement("li");
            listItem.setAttribute("class", "listClass");
            listItem.innerHTML = weatherStations[i].name;
            let listButton = document.createElement("button");
            listButton.setAttribute("class", "listButton");
            listButton.innerHTML = "Välj";
            appList.appendChild(listItem).appendChild(listButton);


            
            
            listButton.addEventListener("click", function (e) {
                    var tags = document.getElementsByTagName("h3");
                    for (tag of tags) {
                        var town = weatherStations[i].name;
                        tag.innerHTML = town;
                }

                clickedLongitute = getLong(weatherStations[i]);
                clickedLatitude = getLat(weatherStations[i]);
                getTown(clickedLongitute, clickedLatitude);
                clearPresent();
            })
        }


        ////////////////////////////////////////////////////////////
        ///////////GÖR FÖRSTA BOKSTAV I STRÄNG TILL STOR BOKSTAV
        function capitalizeFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }


        ////////////////////////////////////////////////////////////
        /////////////////////////////////RENSAR LISTA PÅ TIDIGARE INFO
        function clearPresent() {

            let placeHolder = document.getElementsByClassName("listContainer");
            for (let places of placeHolder) {
                if (places.childNodes.length == 1) {
                    places.childNodes[0].remove();
                }
            }

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

                function prognos(index) {
                    ///////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////TAR FRAM 10 DAGARSPROGNOS OCH SKAPAR LISTITEMS MED DENNA INFO////

                    var nu = index.validTime;
                    var aktuellDag = nu.slice(0, 10);


                    let timeParameterIndex = index.parameters;

                    var temp = timeParameterIndex.find(element => element.name === "t");
                    var nederbrPrognos = timeParameterIndex.find(element => element.name === "pcat");
                    var mps = timeParameterIndex.find(element => element.name === "ws")
                    var molnTotal = timeParameterIndex.find(element => element.name === "tcc_mean")
                    var humidity = timeParameterIndex.find(element => element.name === "r");

                    var elmntTime = document.createElement("ul")
                    elmntTime.innerHTML = "Datum: " + aktuellDag;
                    var elmntTemp = document.createElement("li")
                    elmntTemp.innerHTML = temp.values + "°C";
                    var elmntWind = document.createElement("li")
                    elmntWind.innerHTML = mps.values + " m/sek";
                    var elmntHumidity = document.createElement("li")
                    elmntHumidity.innerHTML = humidity.values[0] + "% luftfuktighet";
                    var elmntCloud = document.createElement("li");
                    elmntCloud.innerHTML = getMoln(molnTotal.values[0]);
                    var elmntRain = document.createElement("li");
                    elmntRain.innerHTML = getRegn(nederbrPrognos.values[0]);


                    elmntTime.appendChild(elmntTemp);
                    elmntTime.appendChild(elmntWind);
                    elmntTime.appendChild(elmntHumidity);
                    elmntTime.appendChild(elmntCloud);
                    elmntTime.appendChild(elmntRain);


                    function getMoln(moln) {
                        var molnighet;
                        switch (moln) {
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
                        return molnighet;
                    }

                    function getRegn(regn) {
                        var nederbrd;
                        switch (regn) {
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
                        return nederbrd;

                    }
                    ////////////////////////////////////////
                    ///////////////////////////////////////
                    //RETURNAR EN <ul> MED  <li> APPENDADE
                    return elmntTime;

                }
                

                let dayOne = 0
                let datedOne = getDate(dayOne)
                var timeToday = document.getElementById('TimeToday');
                var newList = prognos(datedOne);
                timeToday.appendChild(newList);
                //////////////////////////////////////////////////////////////////////////////////////
                ///////////////TAR FRAM AKTUELL DAG, OCH APPENDAR PROGNOSFUNKTIONENS RETURNADE VÄRDE I 
                ///////////////DEN DIV SOM SKA PRESENTERA LISTAN
                ///////////////////////////////////////////////////////////////////////////////////////

                let dayTwo = 1
                let datedTwo = getDate(dayTwo)
                var timeTomorrow = document.getElementById("TimeTomorrow");
                var newTomorrowList = prognos(datedTwo);
                timeTomorrow.appendChild(newTomorrowList)

                let dayThree = 2
                let datedThree = getDate(dayThree)
                var TimeDayThree = document.getElementById("TimeDayThree");
                var newDag3 = prognos(datedThree);
                TimeDayThree.appendChild(newDag3)

                let dayFour = 3
                let datedFour = getDate(dayFour)
                var TimeDayFour = document.getElementById("TimeDayFour");
                var newDag4 = prognos(datedFour);
                TimeDayFour.appendChild(newDag4)

                let dayFive = 4
                let datedFive = getDate(dayFive)
                var TimeDayFive = document.getElementById("TimeDayFive");
                var newDag5 = prognos(datedFive);
                TimeDayFive.appendChild(newDag5)
                
                let daySix = 5
                let datedSix = getDate(daySix)
                var TimeDaySix = document.getElementById("TimeDaySix");
                var newDag6 = prognos(datedSix);
                TimeDaySix.appendChild(newDag6)

                let daySeven = 6
                let datedSeven = getDate(daySeven);
                var TimeDaySeven = document.getElementById("TimeDaySeven");
                var newDag7 = prognos(datedSeven);
                TimeDaySeven.appendChild(newDag7)

                let dayEight = 7
                let datedEight = getDate(dayEight);
                var TimeDayEight = document.getElementById("TimeDayEight");
                var newDag8 = prognos(datedEight);
                TimeDayEight.appendChild(newDag8)

                let dayNine = 8
                let datedNine = getDate(dayNine);
                var TimeDayNine = document.getElementById("TimeDayNine");
                var newDag9 = prognos(datedNine);
                TimeDayNine.appendChild(newDag9)

                let dayTen = 9
                let datedTen = getDate(dayTen)
                var TimeDayTen = document.getElementById("TimeDayTen");
                var newDag10 = prognos(datedTen);
                TimeDayTen.appendChild(newDag10)

//////////////////////////////////////////////////////////                
//////////////////////////// HÄMTAR DATUM ////////////////
                function getFullDate(dateOfChoice) {
                    let date = new Date();
                    let year = date.getFullYear();
                    let month = date.getMonth() + 1;
                    let day = date.getDate() + dateOfChoice;
  
                    return year + "-" + month + "-" + day;
                  }
  
                  function getDate(day){
      
                      var indexDay = getFullDate(day);
                      var timeStamps = townData.timeSeries;
                      var indexOfDay = "";
      
                      for (i = 0; i < timeStamps.length; i++) {
                          var slicedTimeStamps = timeStamps[i].validTime;
                          if(slicedTimeStamps.slice(0, 10) == indexDay) {
                              indexOfDay = timeStamps[i];
                          }
                      }
                      return indexOfDay;
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