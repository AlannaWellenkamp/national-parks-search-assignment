'use: strict';

const apiKey = 'qloeqISPUSKm2wlaPoDL7yPgNvjwOSHwPKBeDvO5'
const searchURL = 'https://developer.nps.gov/api/v1/parks'

function formatQueryParams(params) {
    const queryItems = Object.keys(params).map(key => `${[key]}=${(params[key])}`);
    return queryItems.join('&');
}

function displayResluts(responseJson) {
    console.log(responseJson);
    if (responseJson.data.length === 0) {
        alert('Please be sure to enter two letter state codes, separated by a comma and space as seen in the example')
    }
    else {
        $('#js-error-message').empty();
        $('#results-list').empty();
        for (let i = 0; i < responseJson.data.length; i++) {
            $('#results-list').append(
                `<li id="json-${i}"><h3>${responseJson.data[i].fullName}</h3>
                <p>${responseJson.data[i].description}</p>
                <p>Website: <a href='${responseJson.data[i].url}'>${responseJson.data[i].url}</a></p>
                </li>`);
            if (responseJson.data[i].addresses[0]) {
                $(`#json-${i}`).append(`
                <p>Address: ${responseJson.data[i].addresses[0].line1}, 
                ${responseJson.data[i].addresses[0].city}, 
                ${responseJson.data[i].addresses[0].stateCode} 
                ${responseJson.data[i].addresses[0].postalCode}</p>`);
            }
            else {
                $(`#json-${i}`).append('<p>No address found</p')
            }
        };
        $('#results').removeClass('hidden');
    }
}

function getSearchResults(states, maxResults) {
    const params = {
        api_key: apiKey,
        stateCode: states,
        limit: maxResults,
    };

    const queryString = formatQueryParams(params)
    const url = searchURL + '?' + queryString;

    console.log(url);

    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => displayResluts(responseJson))
        .catch(err => {
            $('#js-error-message').text(`Sorry, something went wrong: ${err.message}`)
        })

}

function submitListen() {
    $('#js-search-form').submit(e => {
        e.preventDefault();
        const states = $('#state').val().split(", ");
        console.log(states);
        const maxResults = $('#max-results').val();
        console.log(maxResults);
        getSearchResults(states, maxResults);
    })
}

function runApp() {
    console.log("app running");
    submitListen();
}



$(runApp);