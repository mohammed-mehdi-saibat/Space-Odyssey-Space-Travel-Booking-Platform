"use strict";

fetch("data.json")
  .then((response) => response.json())
  .then((data) => {
    console.log(data.destinations);
    console.log(data.packages);
    console.log(data.suitSizes);
    console.log(data.extrasgit);
  });
