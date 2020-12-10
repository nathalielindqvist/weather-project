

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
        for (let i = 0; i < weatherStations.length; i++) {
            let listItem = document.createElement("li");
            listItem.setAttribute("class", "listClass");
            listItem.innerHTML = weatherStations[i].name;
            let listButton = document.createElement("button");
            listButton.setAttribute("class", "listButton");
            listButton.innerHTML = "Button";
            appList.appendChild(listItem).appendChild("listBtn");

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

                function prognos(index) {

                    var nu = townData.timeSeries[0].validTime;
                    var nuvarandeTid = nu.slice(11, 16);

                    let timeParameterIndex = townData.timeSeries[index].parameters;

                    var temp = timeParameterIndex.find(element => element.name === "t");
                    var nederbrPrognos = timeParameterIndex.find(element => element.name === "pcat");
                    var mps = timeParameterIndex.find(element => element.name === "gust")
                    var molnTotal = timeParameterIndex.find(element => element.name === "Wsymb2")
                    // var molnTotal = (townData.timeSeries[index].parameters[7].values[0]);

                    var humidity = timeParameterIndex.find(element => element.name === "r");

                    var elmntTime = document.createElement("ul")
                    elmntTime.innerHTML = "-----Klockan " + nuvarandeTid;
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
                        console.log(regn);
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
                    return elmntTime;

                }


                console.log("Väder för idag");
                var idag = 0;
                var timeToday = document.getElementById('TimeToday');
                var newList = prognos(idag);
                timeToday.appendChild(newList);



                //////console.log("Väderprognos för resten av dagen:")//////
                console.log("Väderprognos för imorgon:");
                var imorgon = 24;
                var timeTomorrow = document.getElementById("TimeTomorrow");
                var newTomorrowList = prognos(imorgon);
                timeTomorrow.appendChild(newTomorrowList);





            } catch (error) {
                console.error(error);
            }
        }

    } catch (error) {
        console.error(error);
    }
}

getSmhi();