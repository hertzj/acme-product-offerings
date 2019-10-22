const container = document.querySelector('#container')

const grabCompanies = () => new Promise((res, rej) => {
    return window.fetch('https://acme-users-api-rev.herokuapp.com/api/companies')
        .then(response => response.json())
        .then(jsonData => res(jsonData))
        .catch(e => rej(e));
});


const grabProducts = () => new Promise((res, rej) => {
    return window.fetch('https://acme-users-api-rev.herokuapp.com/api/products')
        .then(response => response.json())
        .then(jsonData => res(jsonData))
        .catch(e => rej(e))
})

const grabOfferings = () => new Promise((res, rej) => {
    return window.fetch('https://acme-users-api-rev.herokuapp.com/api/offerings')
        .then(response => response.json())
        .then(jsonData => res(jsonData))
        .catch(e => rej(e))
})



const render = () => Promise.all([grabCompanies(), grabProducts(), grabOfferings()]).then(response => {
    console.log('response ', response);
    const [companies, products, offerings] = response;

    container.innerHTML = ''

    products.forEach(product => {
        const prodDiv = document.createElement('div')
        prodDiv.classList.add('product')
        const prodName = product.name.toUpperCase();
        const price = Number(product.suggestedPrice).toFixed(2)
        const prodId = product.id;

        const title = document.createElement('h2');
        title.innerHTML = `<a href="#${prodId}">${prodName}</a>`
        prodDiv.appendChild(title);

        const description = document.createElement('p');
        description.innerHTML = `${product.description}`;
        prodDiv.appendChild(description);

        const suggestedPrice = document.createElement('p');
        suggestedPrice.innerHTML = `$${price}`;
        prodDiv.appendChild(suggestedPrice);

        const listOfferings = document.createElement('ul');

        offerings.forEach(offering => {
            const offeringProdId = offering.productId;
            const offeringPrice = Number(offering.price).toFixed(2)
            const offeringCompanyId = offering.companyId;

            if (prodId === offeringProdId) {
                const listItem = document.createElement('li');

                companies.forEach(company => {
                    if (offeringCompanyId === company.id) {
                        listItem.innerHTML = `Offered by: ${company.name} $${offeringPrice}`
                    }
                })

                listOfferings.appendChild(listItem)
            }
        })

        prodDiv.appendChild(listOfferings);

        container.appendChild(prodDiv);

    })
})

const renderProduct = () => Promise.all([grabCompanies(), grabProducts(), grabOfferings()]).then(response => {
    console.log('response ', response);
    const [companies, products, offerings] = response;

    container.innerHTML = ''

    const hash = window.location.hash.slice(1);

    products.forEach(product => {
        if (product.id === hash) {
            const prodDiv = document.createElement('div')
            prodDiv.classList.add('productHighlight')
            const prodName = product.name.toUpperCase();
            const price = Number(product.suggestedPrice).toFixed(2);
            const prodId = product.id;
    
            const title = document.createElement('h2');
            title.innerHTML = `<a href="#">${prodName}</a>`
            prodDiv.appendChild(title);
    
            const description = document.createElement('p');
            description.innerHTML = `${product.description}`;
            prodDiv.appendChild(description);
    
            const suggestedPrice = document.createElement('p');
            suggestedPrice.innerHTML = `$${price}`;
            prodDiv.appendChild(suggestedPrice);
    
            const listOfferings = document.createElement('ul');
    
            offerings.forEach(offering => {
                const offeringProdId = offering.productId;
                const offeringPrice = Number(offering.price).toFixed(2)
                const offeringCompanyId = offering.companyId;
    
                if (prodId === offeringProdId) {
                    const listItem = document.createElement('li');
    
                    companies.forEach(company => {
                        if (offeringCompanyId === company.id) {
                            listItem.innerHTML = `Offered by: ${company.name} $${offeringPrice}`
                        }
                    })
    
                    listOfferings.appendChild(listItem)
                }
            })
    
            prodDiv.appendChild(listOfferings);
    
            container.appendChild(prodDiv);
        }


    })
})

window.addEventListener('hashchange', ev => {
    if (window.location.hash.slice(1)) {
        renderProduct()
    }
    else {
        render()
    }
})

render()