var $ = jQuery;


var vitrineLoader = (lista, el) => {

    var tipoVitrine = $(el).data('vitrine').tipo;
    var productsList = [];


    $.each(lista.products, function (index, val) {
        var warranty = val.has_garantia;

        var insurance = val.has_seguro;

        var classBtnDefault = 'add-cart check-services btn-secondary btn-full icon icon-carrinho icon-btn';

        if (warranty === 'sim' && insurance === 'não') {
            classBtnDefault = `${classBtnDefault} product-has-warranty`
        } else if (insurance === 'sim' && warranty === 'não') {
            classBtnDefault = `${classBtnDefault} product-has-insurance`
        } else if (warranty === 'sim' && insurance === 'sim') {
            classBtnDefault = `${classBtnDefault} product-has-warranty product-has-insurance`
        }


        var productObj = {
            name: val.name,
            id: val.sku,
            price: val.price_block.credit_card.value_with_discount.replace('R$', '').replace(/,/g, '.').replace(/^\s+|\s+$/g, ""),
            brand: val.brand,
            category: val.categories_name_path,
            variant: val.type_id,
            list: $(el).attr('page'),
            position: index + 1,
            vitrine: $(el).data('vitrine').tipo
        }

        productsList.push(productObj)

        function showDigitalSeal(value) {
            return value ? "digital" : ""
        }

        function fixImageUrl(productInfo) {
            let valueSplitted = productInfo.image.split(".")
            let conditions = productInfo.type_id == "grouped" && valueSplitted[valueSplitted.length - 1] == "png" || valueSplitted[valueSplitted.length - 1] == "jpg" || valueSplitted[valueSplitted.length - 1] == "jpeg"
            return conditions ? productInfo.image : productInfo.image + "300&a=-1"
        }

        function doTruncarStr(str, size) {
            conditions = str == undefined || str == 'undefined' || str == '' || size == undefined || size == 'undefined' || size == ''
            !conditions ? $(window).width() < 425 ? size = 50 : size : ''
            return str.length > size + 3 ? str.substring(0, size).replace(/\./g, '. ').concat('...') : str
        }

        function validateSale(sale) {
            return sale > 0 ? `<span class="tagSale">${sale}%</span>` : ''
        }

        function validAuthors(authors, data) {
            return authors.length ? authors.map((author, index) => `${author.name}<br />`).join('') : ""
        }

        function funcRating(rating) {

            return rating > 0.0 ? `
            <div class="ratings">
                <a href="${val.url}" title="${val.name}" data-track="click">
                    <div class="rating-box">
                        <div class="rating" style="width: ${val.reviews_stars_width}%;"></div>
                    </div>
                </a>
            </div>` : `
            <div class="ratings"></div>
            `
        }

        function validPre(pre) {
            return pre ? 'pré-venda' : '';
        }

        function validPrace(por) {
            return por.nominal === por.final ? '' : `R$ ${por.nominal}`
        }

        function validacaoParcelamentoPorce(porce) {
            return porce.discount_percent != 0 ? `(${porce.discount_percent}%)` : ''
        }

        function validacaoParcelamento(parce1, parce2) {
            if (parce1.value_with_discount === parce2.nominal) {
                return '';
            } else if (parce1.value_with_discount === parce2.value_installments_without_fee) {
                return `em até ${parce1.qty_installments_with_discount}x no crédito`;
            } else if (parce1.has_discount !== 0 && parce2.value_installments_without_fee == 0) {
                return `em até ${parce1.qty_installments_with_discount}x no crédito`;
            }
            return `em ${parce1.qty_installments_with_discount}x no crédito <br /> ou em até ${parce2.qty_installments_without_fee}x de R$ ${parce2.value_installments_without_fee} `;
        }

        function validSaraiva(sara) {
            if (sara.discount_percent == 0 && sara.total_value_installments_with_fee == '0,00') {
                return `em ${sara.qty_installments_with_discount}x sem juros no Cartão Saraivas`
            } else if (sara.discount_percent == 0) {
                return `em ${sara.qty_installments_without_fee}x sem juros no Cartão Saraiva b`
            }
            return `R$ ${sara.value_with_discount} <span class="vProduct-percentDiscount">(${sara.discount_percent}% de desconto)</span> no Cartão Saraiva`
        }

        function validateOnSale(onSale, data) {
            return (onSale.length && onSale[0].category) ? `<div class="content__category"><img src="${onSale[0].category.url}" title="${onSale[0].category.text}"></div>` : `<div class="content__category"></div>`
        }

        function limitTitleShowcase(title, size) {
            return title.length > size ? `${title.substring(0, size + 3)}...` : title
        }

        function sobEncomenda(status) {
            return status ? status : false
        }
        var timeUrgency = (data, sku) => {

            const apiUrl = 'https://api.saraiva.com.br/';
            $.ajax({
                url: `${apiUrl}produto/urgencycards/${data.sku}=${data.rule_urgency}`,
                dataType: 'json',
                async: true,
                success: function (response) {

                }
            });
        }



        var ratingPerCent = (rating, reviews_count) => {
            return reviews_count ? `<div class="rating__grade"><div class="grade" style="width: ${rating}%;"></div></div><div class="product__reviews">(${reviews_count})</div>` : `<div class="rating__grade"><div class="grade" style="width: ${rating}%;"></div></div><div class="product__reviews product__reviews--eval">(Avalie agora)</div>`
        }


        var titleAndAuthor = (data) => {
            var authorsName = "";
            var authors = data.authors.forEach((element, index) => {
                authorsName += `${element.name} / `
            });
            var lastIndexBar = authorsName.lastIndexOf('/')

            var titleAuthor = `
                <h3 class="product__title">${doTruncarStr(data.name, 47)}</h3>
                <h4 class="book__author">${doTruncarStr(authorsName.slice(0, lastIndexBar), 30)}</h4>
            `
            var titleExpanded = `
                <h3 class="product__title product__title--expanded">${doTruncarStr(data.name, 50)}</h3>
            `
            return data.authors.length ? titleAuthor : titleExpanded
        }

        htmlShowCaseAspirational =
            `<div class="product__aspirational" data-pid="${val.id}" id="coleAspi__showcase-'${val.id}" data-sku="${val.sku}" data-sob="${sobEncomenda(val.back_order)}" itemscope itemtype="http://schema.org/Product">
            <div class="product__container">
                <div class="container__img">
                    <img src="${fixImageUrl(val)}" class="lazy" alt="${val.name}">
                </div>
            </div>
            <div class="container__info">
                <div class="container__values">
                    <span class="container__special_price" itemprop="price">R$  ${val.price_block.credit_card.value_with_discount}</span>
                </div>
            </div>
            <div class="container__name" itemprop="name">
                <h2>${limitTitleShowcase(val.name, 65)}</h2>
            </div>
        </div>`

        htmlShowcase =
            `<div class="product__comum " data-sku="${val.sku}" data-track="true" data-track-name="${val.name}" data-track-id="${val.id}" data-track-price="${val.price}" data-track-brand="${val.brand}"  data-track-category="${val.category}" data-track-variant="${val.variant}" data-track-position="${val.position}" data-track-vitrine="${val.vitrine}">
            <div class="product__content">
                <div class="content__left">
                    <figure>
                        <a href="${val.url}" data-track="click">
                            <div class="content__img ${showDigitalSeal(val.digital)}">
                                <img src="${fixImageUrl(val)}" title="${val.name}" />
                                ${validateSale(val.price_block.price.discount_percent)}
                            </div>
                        </a>
                    </figure>
                </div>
                <div class="content__right">
                    <div class="content__text">
                        <a href="${val.url}" data-track="click">
                            <span class="title">${doTruncarStr(val.name, 40)}</span>
                            <span class="subtitle">${validAuthors(val.authors, val)}</span>
                        </a>
                        ${funcRating(val.reviews_stars_width)}
                        <div class="bottom-block-price" data-pre="${validPre(val.presale)}">
                            <span class="preorder">${validPre(val.presale)}</span>
                            <span class="list_price_group">
                                <span class="price">${validPrace(val.price_block.price)}</span>
                                <span class="special_price">R$  ${val.price_block.credit_card.value_with_discount}</span>
                                <span class="discount_value">${validacaoParcelamentoPorce(val.price_block.credit_card)}</span>
                                <span class="discount_cc">${validacaoParcelamento(val.price_block.credit_card, val.price_block.price)}</span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            ${validateOnSale(val.on_sale, val)}
            <div class="content__saraiva-card">
                <i></i>
                <span class="saraiva-card__info">${validSaraiva(val.price_block.saraiva_card)}</span>
            </div>
            <div class="content__action">
                <button type="button" title="Comprar" class="${classBtnDefault}" data-sku="${val.sku}" id="btn-cart">Adicionar ao Carrinho</button>
            </div>
        </div>`

        htmlShowcase = `<div class="product__comum nova loading" data-sku="${val.sku}" data-track="true" data-track-list="${val.list}"data-track-name="${val.name}" data-track-id="${val.id}" data-track-price="${val.price}" data-track-brand="${val.brand}"  data-track-category="${val.category}" data-track-variant="${val.variant}" data-track-position="${val.position}" data-track-vitrine="${val.vitrine}">
                    <div class="box__product" data-href="${val.url}">
                            <div class="product__pic">
                                <div class="seal ${showDigitalSeal(val.digital)}"></div>
                                <figure>
                                        <a href="${val.url}"><img src="${fixImageUrl(val)}" alt="${val.name}"/></a>
                                        ${validateSale(val.price_block.price.discount_percent)}
                                </figure>
                                <div class="product__seal">${validateOnSale(val.on_sale)}</div>
                            </div>
                            <div class="product__info">
                                <div class="product__status">${validPre(val.presale)}</div>
                                    <div class="product__title_author">
                                        <a href="${val.url}" data-track="click">   
                                            ${titleAndAuthor(val)}
                                        </a>
                                    </div>
                                    <div class="product__rating">${ratingPerCent(val.reviews_stars_width, val.reviews_count)}</div>
                                    <div class="product__seller">Vendido por Saraiva </div>
                                </div>
                            <div class="product__price">
                                <div class="price__before">${validPrace(val.price_block.price)}</div>
                                <div class="price__after">
                                    <div class="price">R$ ${val.price_block.credit_card.value_with_discount}</div>
                                    <!--div class="stores__offer">
                                        <a href="${val.url}" data-track="click">+ <span>...</span> ofertas</a>
                                    </div-->
                                </div>
                                <div class="product__conditions">${validacaoParcelamento(val.price_block.credit_card, val.price_block.price)}</div>
                                <div class="content__action"><button type="button" title="Comprar" class="${classBtnDefault}" data-sku="${val.sku}" id="btn-cart">Adicionar ao Carrinho</button></div>
                            </div>
                        </a>
                    </div>
                    <div class="spinner">
                        <div class="bounce1"></div>
                        <div class="bounce2"></div>
                        <div class="bounce3"></div>
                    </div>
                </div>`



        htmlShowcaseEstante =
            `<div class="product__estante" data-track="true" data-track-list="${val.list}"data-track-name="${val.name}" data-track-id="${val.id}" data-track-price="${val.price}" data-track-brand="${val.brand}"  data-track-category="${val.category}" data-track-variant="${val.variant}" data-track-position="${val.position}" data-track-vitrine="${val.vitrine}">
                <a href="${val.url}" data-track="click">
                    <figure>
                        <div class="seal ${showDigitalSeal(val.digital)}"></div>
                            <img alt="${val.name}" src="${fixImageUrl(val)}">
                        <figcaption>
                            <div class="content__product">
                                <div class="price-group">
                                    <div class="preorder">${validPre(val.presale)}</div>
                                    <div class="price">${validPrace(val.price_block.price)}</div>
                                    <div class="special-price">R$ ${ val.price_block.credit_card.value_with_discount}</div>
                                    <div class="discount-cc">${validacaoParcelamento(val.price_block.credit_card, val.price_block.price)}</div>
                                </div>
                            </div>
                        </figcaption>
                    </figure>
                </a>
            </div>`

        htmlShowcaseClassicos =
            `<li class="destaques__box" data-track="true" data-track-list="${val.list}"data-track-name="${val.name}" data-track-id="${val.id}" data-track-price="${val.price}" data-track-brand="${val.brand}"  data-track-category="${val.category}" data-track-variant="${val.variant}" data-track-position="${val.position}" data-track-vitrine="${val.vitrine}">
                <a href="${val.url}" data-track="click">
                    <div class="box__img-prod">
                        <img src="${fixImageUrl(val)}" title="${val.name}" />
                    </div>
                    <div class="box__book">
                        <div class="box__centralizado">
                            <h3>${doTruncarStr(val.name, 40)}</h3>
                            <small>${(val.brand)}</small>
                            <p>${doTruncarStr(val.description, 260)}</p>
                            <button class="cta">CONFIRA</button>
                        </div>
                    </div>
                </a>
            </li>`

        htmlShowcaseEbooks =
            `<div class="product__ebooks" data-track="true" data-track-list="${val.list}"data-track-name="${val.name}" data-track-id="${val.id}" data-track-price="${val.price}" data-track-brand="${val.brand}"  data-track-category="${val.category}" data-track-variant="${val.variant}" data-track-position="${val.position}" data-track-vitrine="${val.vitrine}">
                <a href="${val.url}" data-track="click">
                    <figure>
                        <div class="seal ${showDigitalSeal(val.digital)}"></div>
                        <img alt="${val.name}" src="${fixImageUrl(val)}">
                    </figure>
                </a>
            </div>`

        htmlShowcaseMural =
            `<div class="product__mural" data-track="true" data-track-list="${val.list}"data-track-name="${val.name}" data-track-id="${val.id}" data-track-price="${val.price}" data-track-brand="${val.brand}"  data-track-category="${val.category}" data-track-variant="${val.variant}" data-track-position="${val.position}" data-track-vitrine="${val.vitrine}">
                <a href="${val.url}" data-track="click">
                    <figure style="margin: 0;">
                        <div class="seal ${showDigitalSeal(val.digital)}"></div>
                            <img alt="${val.name}" src="${fixImageUrl(val)}">
                    </figure>
                </a>
            </div>`;

        tipoVitrine == "comum" ? htmlShowcase : tipoVitrine == "aspiracional" ? htmlShowcase = htmlShowCaseAspirational : tipoVitrine == "ebooks" ? htmlShowcase = htmlShowcaseEbooks : tipoVitrine == "mural" ? htmlShowcase = htmlShowcaseMural : tipoVitrine == "classicos" ? htmlShowcase = htmlShowcaseClassicos : htmlShowcase = htmlShowcaseEstante

        $(el).append(htmlShowcase)

        tipoVitrine == "estante" && $(window).width() >= 1024 && index == lista.length - 1 ? $(el).append($(`<div class="product__estante product__estante--cta-ver-todos"><a href="https://www.saraiva.com.br/${$(el).data('vitrine').link}">ver todos os produtos</a></div>`)) : null


    });


    if (typeof dataLayer !== "undefined") {
        dataLayer.push({
            'event': 'productImpression',
            'ecommerce': {
                'currencyCode': 'BRL',
                'impressions': productsList
            }
        });
    }

}

var htmlModal = (product, id, sob, element) => {
    var warranty,
        insurance,
        classBtnDefault;

    warranty = product.warranty;
    insurance = product.insurance;

    if (warranty !== '' && warranty !== null && typeof warranty !== 'undefined' && insurance !== '' && insurance !== null && typeof insurance !== 'undefined') {
        classBtnDefault = 'add-cart check-services btn-secondary btn-full icon icon-carrinho icon-btn product-has-warranty product-has-insurance'
    } else {
        classBtnDefault = 'add-cart check-services btn-secondary btn-full icon icon-carrinho icon-btn';
    }



    var funcRating = (rating) => {
        if (rating > 0.0) {
            return 'rating-box';
        } else {
            return 'rating-box rating-box-desabled';
        }
    }

    var limitarQtdCaracteres = (params, size) => {
        return params.length > size ? `${params.substring(0, size)}...` : params
    }

    var validacaoPreco = (por) => {
        if (por.nominal === por.final) {
            return '';
        } else {
            return `De: R$ ${por.nominal}`
        }
    }

    var validacaoParcelamento = (parce1, parce2) => {
        if (parce1.value_with_discount === parce2.nominal || parce1.has_discount === 0) {
            return '';
        } else if (parce1.has_discount !== 0) {
            return '<div class="discount_cc"><div class="cartao-total"><span>Parcelado:</span> R$ ${parce2.total_value_installments_with_fee} </div> em atÃ© ${parce2.qty_installments_without_fee}x de <span class="value-different">R$ ${parce2.value_installments_with_fee}</span> sem juros</div>';
        }
        return 'Em ${parce1.qty_installments_with_discount}x no cartão';
    }



    var validSaraiva = (sara) => {

        var num = parseInt(sara.qty_installments_with_discount, 10);
        if (num === sara.qty_installments_without_fee) {
            return `Cartão Saraiva: <span class="value-different">${sara.qty_installments_with_discount}x de R$ ${sara.value_with_discount}</span>`
        } else {
            return `Cartão Saraiva: <span class="value-different">${sara.qty_installments_with_discount}x de R$ ${sara.value_with_discount}</span> <span class="vProduct-percentDiscount">(-${sara.discount_percent}%)</span> ou em até ${sara.qty_installments_without_fee}x de R$ ${sara.value_installments_without_fee} sem juros`
        }
    }

    var htmlProduct = `<div class="modal__product">
                        <div class="fechar">
                            <div class="fechar-icon">
                                <svg width="21px" height="21px" fill="#818181">
                                    <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-fechar">
                                        <symbol id="icon-fechar" viewBox="0 0 256 256">
                                            <title>Artboard 41</title>
                                            <path d="M54.79 213.86a3 3 0 0 1-2.23-5l69.58-77.32a5.27 5.27 0 0 0 0-7.07L52.56 47.15a3 3 0 0 1 4.46-4l69.58 77.32a11.26 11.26 0 0 1 0 15.1L57 212.87a3 3 0 0 1-2.21.99z" fill="#14171c"></path><path d="M201.21 213.86a3 3 0 0 1-2.23-1l-69.58-77.31a11.26 11.26 0 0 1 0-15.1L199 43.13a3 3 0 0 1 4.46 4l-69.58 77.32a5.27 5.27 0 0 0 0 7.07l69.59 77.32a3 3 0 0 1-2.23 5z" fill="#14171c"></path>
                                        </symbol>
                                    </use>
                                </svg>
                            </div>
                        </div>
                        <div class="left__content">
                            <div class="title">
                                <h2>${limitarQtdCaracteres(product.name, 99)}</h2>
                            </div>
                            <div class="rating">
                                <div class="${funcRating(product.reviews_stars_width)}">
                                    <div class="rating" style="width:${product.reviews_stars_width}%;"></div>
                                </div>
                            </div>
                            <div class="image">
                                <div class="content__image">
                                    <img src="https://images.livrariasaraiva.com.br/imagemnet/imagem.aspx/?pro_id=${id}&qld=90&l=430&a=-1">
                                </div>
                            </div>
                            <div class="description">
                                ${limitarQtdCaracteres(product.description, 350)}
                            </div>
                        </div>
                        <div class="right__content">
                            <div class="encomenda" data-status="${sob}">
                                Produto sob encomenda
                            </div>
                            <div class="price--before">
                                <span class="price">${validacaoPreco(product.price_block.price)}</span>
                            </div>
                            <div class="price--after">
                                <span>Por:</span> R$ ${product.price_block.credit_card.value_with_discount}
                                <div class="price__parcelas">
                                    <span class="desconto">${validacaoParcelamento(product.price_block.credit_card, product.price_block.price)}</span>
                                </div>
                            </div>
                            <div class="cartao">
                                ${validacaoParcelamento(product.price_block.credit_card, product.price_block.price)}
                            </div>
                            <div class="cartao--saraiva">
                                ${validSaraiva(product.price_block.saraiva_card)}
                            </div>
                            <div class="button">
                                <button type="button" title="Comprar" class="${classBtnDefault}" data-sku="${id}" id="btn-cart"></button>
                            </div>
                        </div>
                        <div class="footer__content">
                            <a href="/${product.url}">Ver tudo sobre o produto</a>
                                <div class="footer__icon"></div>
                        </div>
                    </div>`
    $(element).closest('[data-vitrine]').find('.modal').append(htmlProduct);
}

var sobEncomenda = (status) => {
    return status ? status : false
}

var loadProduct = (id, sob, element) => {

    var sku = id;
    var sob = sob;
    $.ajax({
        url: `https://api.saraiva.com.br/sc/produto/pdp/${sku}/0/0/1/`,
        dataType: 'json',
        beforeSend: function () {
            $('[data-vitrine] .modal').append('<img class="load-ajaxing" style="display:block;margin:100px auto 70px;" src="http://www.saraiva.com.br/skin/frontend/saraiva/saraiva/images/opc-ajax-loader.gif" alt="">');
        },
        success: function (data) {
            htmlModal(data, id, sob, element);
        },
        complete: function (resposta) {
            $('[data-vitrine] .modal .load-ajaxing').remove();
        }
    });
}

var openModal = (element) => {
    var sku = $(element).data('sku');
    var sob = $(element).data('sob');
    var vitrine = $(element).closest('[data-vitrine]')
    loadProduct(sku, sob, element)
    $("<div class='modal'></div>").hide().appendTo($(vitrine)).fadeIn('fast')
    $("<div class='overlay'></div>").hide().appendTo($(vitrine)).fadeIn('slow')


    if (width <= 768) {
        $('body').addClass('no-scroll');
    }
}

var closeModal = () => {
    $('[data-vitrine] .modal, [data-vitrine] .overlay').fadeOut('slow', function () {
        $(this).remove()
    })
    if (width <= 768) {
        $('body').removeClass('no-scroll');
    }
}

var addToCardOnClick = (e, element) => {
    e.preventDefault();
    var idSku = $(element).data('sku');
    cartCatalog.addToCart(idSku, 1);
}

var addToCartOnModal = (e) => {
    e.preventDefault();
    var idSku = $(e.currentTarget).data('sku');
    cartCatalog.addToCart(idSku, 1);

    dataLayer.push({
        'event': 'addToCart',
        'ecommerce': {
            'currencyCode': 'BRL',
            'add': {
                'products': [{
                    'name': $(e.currentTarget).parents('li').attr('data-track-name'),
                    'id': Number($(e.currentTarget).parents('li').attr('data-track-id')),
                    'price': Number($(e.currentTarget).parents('li').attr('data-track-price')),
                    'brand': $(e.currentTarget).parents('li').attr('data-track-brand'),
                    'category': $(e.currentTarget).parents('li').attr('data-track-category'),
                    'variant': $(e.currentTarget).parents('li').attr('data-track-variant'),
                    'list': $(e.currentTarget).parents('li').attr('data-track-list'),
                    'position': $(e.currentTarget).parents('li').attr('data-track-position'),
                    'quantity': 1,
                    'vitrine': $(e.currentTarget).parents('li').attr('data-track-vitrine')
                }]
            }
        }
    });
}

var dataTrack = (element) => {
    dataLayer.push({
        'event': 'productClick',
        'ecommerce': {
            'click': {
                'actionField': {
                    'list': $(element).data('track-list')
                },
                'products': [{
                    'name': $(element).data('track-name'),
                    'id': Number($(element).data('track-id')),
                    'price': Number($(element).data('track-price')),
                    'brand': $(element).data('track-brand'),
                    'category': $(element).data('track-category'),
                    'variant': $(element).data('track-variant'),
                    'position': $(element).data('track-position'),
                    'vitrine': $(element).data('track-vitrine')
                }]
            }
        },
        'eventCallback': function () {
            document.location = val.url
        }
    });
}


var slickLoadAjax = (thisSlider, id_vitrine) => {
    var data = $(thisSlider).data("vitrine"),
        responsivo = $(thisSlider).data("responsivo"),
        slickOptions = $(thisSlider).data("slick-options"),
        slicked = $(thisSlider).hasClass("slick-initialized");

    // carregar id respectivo passado como parâmetro
    !id_vitrine ? id_vitrine = data.id_vitrine : id_vitrine

    //instruções default
    var responsiveOptionsDefault = [{ breakpoint: 1439, settings: { slidesToShow: 4 } }, { breakpoint: 1023, settings: { slidesToShow: 3 } }, { breakpoint: 767, settings: { slidesToShow: 2 } }, { breakpoint: 424, settings: { slidesToShow: 1 } }],
        slickOptionsDefault = { mobileFirst: true, infinite: false, dots: true, responsive: responsivo ? responsivo : responsiveOptionsDefault },
        mobileScreen = $(window).width() <= 768,
        slickOptionsEstante = {
            mobileFirst: true,
            centerMode: false,
            dots: true,
            arrows: false,
            infinite: false,
            slidesToShow: 2,
            slidesToScroll: 4,
            variableWidth: true,
            responsive: [
                {
                    breakpoint: 1024,
                    settings: {
                        arrows: true,
                        dots: false,
                    }
                }
            ]
        }

    // Se não possuir slick options e não possuir slick options responsiva carregar instruções default
    slickOptions.mobileFirst == false ? slickOptions.mobileFirst : slickOptions.mobileFirst = true
    !slickOptions ? slickOptions = slickOptionsDefault : !responsivo ? slickOptions.responsive = responsiveOptionsDefault : responsivo == "nulo" ? delete slickOptions.responsive : slickOptions.responsive = responsivo


    // Carregar 5 itens apenas no mobile
    mobileScreen && data.tipo != "classicos" ? data.produtos_quantidade = 5 : data.produtos_quantidade = data.produtos_quantidade

    var callAjax = () => {

        $.get(`https://api.saraiva.com.br/collection/products/${id_vitrine}/0/0/1?l=${data.produtos_quantidade}`, function (resposta) {

        }).then(function (resposta) {
            vitrineLoader(resposta, thisSlider)
            $(thisSlider).fadeIn('fast').slick(slickOptions).addClass('active')
        });
    }

    var callAjaxLento = () => {

        $.when(
            $.get(`https://api.saraiva.com.br/collection/products/${id_vitrine}/0/0/1?l=${data.produtos_quantidade}`, function (resposta) {
                console.log(resposta)
                vitrineLoader(resposta, thisSlider)
                $(thisSlider).fadeIn('fast').slick(slickOptions).addClass('active')
            })
        ).then(function (data) {
            var productsSkuListed = ""
            data.products.forEach((produto, index, array) => {
                array != false && index == data.products.length - 1 ? productsSkuListed += `${produto.sku}` : productsSkuListed += `${produto.sku},`
                if (produto.rule_urgency) {
                    $.get(`https://api.saraiva.com.br/produto/urgencycards/${produto.sku}=${produto.rule_urgency}`, function (info) {
                        const urgencyRule = info[produto.sku]
                        if (urgencyRule) {
                            urgencyOptions = {
                                remainingTime: urgencyRule.missing_time,
                                remainingItems: urgencyRule.remaining_quantity,
                                description: urgencyRule.description,
                                showTimer: urgencyRule.show_timer,
                                showItems: urgencyRule.show_counter,
                                toggle: true
                            }
                            function urgencyCounter(options) {
                                // options details
                                const remainingTime = options.remainingTime;
                                const remainingItems = options.remainingItems;
                                const description = options.description;
                                const showTimer = options.showTimer;
                                const showItems = options.showItems;
                                const toggle = options.toggle;

                                // svg defaults 
                                const svgns = "http://www.w3.org/2000/svg";
                                const xlinkns = "http://www.w3.org/1999/xlink";

                                // create html
                                const urgency = document.createElement('div');
                                const urgencyLead = document.createElement('span');
                                const urgencyIcon = document.createElement('i');
                                const urgencyRemainingTime = document.createElement('span');
                                const urgencyRemainingItems = document.createElement('span');
                                const urgencyDescription = document.createElement('p');

                                // add classes
                                urgency.classList.add('urgency');

                                // create icon clock
                                urgencyIcon.classList.add('icon', 'icon-clock');
                                urgencyIcon.setAttributeNS(xlinkns, 'href', '#icon-clock');


                                // add classes
                                urgencyRemainingTime.classList.add('urgency__remaining-time', 'active');
                                urgencyRemainingItems.classList.add('urgency__remaining-items');

                                // toggle remain and timer
                                if (toggle) {
                                    urgency.classList.add('small');

                                    if (showTimer && showItems) {
                                        urgencyRemainingItems.classList.add('hide');

                                        const toggleContent = setInterval(function () {
                                            urgencyLead.classList.toggle('hide');
                                            urgencyIcon.classList.toggle('hide');
                                            urgencyRemainingTime.classList.toggle('hide');
                                            urgencyRemainingItems.classList.toggle('hide');
                                        }, 3000);
                                    }
                                }

                                // create counter
                                if (showTimer) {
                                    urgencyLead.textContent = 'Oferta';
                                    urgencyRemainingTime.textContent = '00:00:00';

                                    let changeTime = remainingTime;
                                    const createCounter = setInterval(function () {
                                        let seconds = changeTime;

                                        if (seconds > 59) {
                                            seconds = seconds % 60;
                                        }
                                        if (seconds < 10) {
                                            seconds = `0${seconds}`
                                        }

                                        let minutes = changeTime / 60;
                                        minutes = minutes % 60;
                                        minutes = Math.floor(minutes);

                                        if (minutes < 10) {
                                            minutes = `0${minutes}`
                                        }

                                        let hours = (changeTime / 60) / 60;
                                        hours = Math.floor(hours);

                                        if (hours < 10) {
                                            hours = `0${hours}`
                                        }

                                        urgencyRemainingTime.textContent = `${hours}:${minutes}:${seconds}`;

                                        changeTime--;
                                        if (changeTime < 0) {
                                            clearInterval(createCounter);
                                            urgency.classList.add('urgency-timeout');

                                            urgencyRemainingItems.textContent = 'Restam 0';
                                            if (toggle) {
                                                clearInterval(toggleContent);
                                                urgencyLead.classList.remove('hide');
                                                urgencyIcon.classList.remove('hide');
                                                urgencyRemainingTime.classList.remove('hide');
                                                urgencyRemainingItems.classList.add('hide');
                                            }
                                        }
                                    }, 1000);
                                }
                                else {
                                    urgency.classList.add('urgency--center');

                                    urgencyLead.classList.add('hide');
                                    urgencyIcon.classList.add('hide');
                                    urgencyRemainingTime.classList.add('hide');
                                }

                                if (showItems) {
                                    let remainText;
                                    if (remainingItems > 1) {
                                        remainText = 'Restam '
                                    } else if (remainingItems < 1) {
                                        remainText = 'Resta '
                                        urgency.classList.add('esgotado')
                                    }

                                    urgencyRemainingItems.textContent = remainText + remainingItems;
                                }
                                else {
                                    urgency.classList.add('urgency--center');
                                    urgencyRemainingItems.classList.add('hide');
                                }

                                // join html
                                urgency.appendChild(urgencyLead);
                                urgency.appendChild(urgencyIcon);
                                urgency.appendChild(urgencyRemainingTime);
                                urgency.appendChild(urgencyRemainingItems);

                                const urgencyWrap = document.createElement('div');
                                urgencyWrap.classList.add('urgency__wrap');

                                if (description && !toggle) {
                                    urgencyDescription.classList.add('urgency__helper');
                                    urgencyDescription.textContent = description;

                                    urgencyWrap.appendChild(urgencyDescription);
                                }
                                urgencyWrap.appendChild(urgency)
                                return urgencyWrap
                            }
                            $(`.product__comum[data-sku="${produto.sku}"]`).each(function (e) {
                                var retorno = urgencyCounter(urgencyOptions)
                                $(this).prepend(retorno)
                            })

                        }
                    });
                }
            });


            // $.get(`//10.234.140.75/buyBox/Loja/16/produto/${productsSkuListed}/lojistaeleito`, function (info, index) {
            //     info.forEach((element, index) => {
            //         element.length && element[0].hasOwnProperty('store_name') ? $(thisSlider).find(`[data-sku] .product__seller`).text(`Vendido por ${element[0].store_name}`) : $(thisSlider).find(`[data-sku] .product__seller`).text(`Vendido por Saraiva`)
            //         $(thisSlider).find(`.nova[data-sku="${element[0].sku}"] .price`).text(`R$ ${element[0].price.final}`)
            //         $(thisSlider).find(`.nova[data-sku="${element[0].sku}"] .stores__offer a`).text(`+ ${element[0].others_stores.qty} ofertas `)
            //     });
            //     //info[0][0].others_stores != false ? element.qtd_ofertas = info[0][0].others_stores.qty : element.qtd_ofertas = 0
            // });

            $(thisSlider).find(`[data-sku]`).removeClass('loading')
        })
    }

    if (slicked) {
        $(thisSlider).fadeOut('fast', function () {
            $(this).slick('unslick').children().remove().promise().done(function () {
                if ($(thisSlider).hasClass('comum')) {
                    callAjaxLento()
                } else {
                    callAjax()
                }
            })
        })
    } else {
        if ($(thisSlider).hasClass('comum')) {
            callAjaxLento()
        } else {
            callAjax()
        }

    }
}


var callCollection = (id_colecao, tamanho_img, margin_right, index, element) => {

    fetch(`https://api.saraiva.com.br/collection/products/${id_colecao}/0/0/1?l=22`)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            tamanho_img < 150 || typeof tamanho_img != "number" ? tamanho_img = 150 : tamanho_img
            var lastDivisible;
            var divisiveis = []
            var divisivel = 2
            data.total_count > 22 ? data.total_count = data.page_count : data.total_count

            if (data.total_count % divisivel != 0) {

                for (index = 0; index < data.total_count; index++) {
                    if (index % divisivel == 0) {

                        divisiveis.push(index)
                    }
                }
                lastDivisible = divisiveis[divisiveis.length - 1] / divisivel
            } else {
                lastDivisible = data.total_count / divisivel
            }
            addCustomAnimation(tamanho_img, margin_right, lastDivisible, element, index)
            createWrappers(data, lastDivisible, divisivel, tamanho_img, element, index)
        });
}
var createWrappers = (data, lastDivisible, divisivel, tamanho_img, element, index) => {

    data.products.slice(0, lastDivisible * divisivel).forEach((elem, index) => {
        if (index % lastDivisible == 0) {
            var div = document.createElement("div")
            div.classList.add('row__slider')
            element.appendChild(div)
        }
    })
    createImages(element.children, lastDivisible, data.products, tamanho_img)
}
var createImages = (where, lastDivisible, products, tamanho_img) => {
    for (const index in where) {
        if (where.hasOwnProperty(index)) {
            const element = where[index];
            var clones = []
            var clonesDoClone = []
            products.slice(index * lastDivisible, (index * lastDivisible) + lastDivisible).forEach(product => {
                var div = document.createElement("div")
                var img = document.createElement("img")
                img.src = `${product.image}${tamanho_img}`
                div.classList.add("img__slider")
                div.setAttribute('data-sku', product.sku)
                div.setAttribute('data-sob', sobEncomenda(product.back_order))
                div.setAttribute('id', `coleAspi__showcase-${product.id}`)
                div.appendChild(img)
                element.appendChild(div)
                clone = div.cloneNode(true)
                clones.push(clone)
            });
            for (let j = 0; j < 4; j++) {
                clones.forEach(clone => {
                    var cloneClone = clone.cloneNode(true)
                    clonesDoClone.push(cloneClone)
                    element.appendChild(clone)
                });
                clonesDoClone.forEach(clone => {
                    element.appendChild(clone)
                })
            }
        }
    }
}
var addCustomAnimation = (tamanho_img, margin, qtd_produtos, element, index) => {
    element.classList.add(`infinito_${index}`)
    var styles = document.styleSheets
    var style = document.createElement("style")
    style.appendChild(document.createTextNode(""))
    document.head.appendChild(style)
    var sizeLeft = (tamanho_img + margin) * qtd_produtos
    if ("insertRule" in styles[styles.length - 1]) {
        styles[styles.length - 1].insertRule(`.slideshow__infinito.infinito_${index} .row__slider {animation: infinito_${index} 15s linear infinite;}`, styles)
        styles[styles.length - 1].insertRule(`@keyframes infinito_${index} {0% {transform: translate3d(0,0,0);}100% {transform: translate3d(-${sizeLeft}px,0,0);}}`, styles)
        styles[styles.length - 1].insertRule(`.slideshow__infinito.infinito_${index} .img__slider {margin-right: ${margin}px !important}`, styles)
    }
    else if ("addRule" in styles[styles.length - 1]) {
        styles[styles.length - 1].addRule(`.slideshow__infinito.infinito_${index} .row__slider {animation: infinito_${index} 15s linear infinite;}`, styles)
        styles[styles.length - 1].addRule(`@keyframes infinito_${index} {0% {transform: translate3d(0,0,0);}100% {transform: translate3d(-${sizeLeft}px,0,0);}}`, styles)
        styles[styles.length - 1].addRule(`.slideshow__infinito.infinito_${index} .img__slider {margin-right: ${margin}px !important}`, styles)

    }
    return style.sheet;
}


$(document).ready(function () {

    $('[data-vitrine]').on('click', '.product__aspirational', function (e) {
        e.preventDefault()
        openModal(e.currentTarget)
    })

    $('[data-vitrine]').click(function (e) {
        if (e.target == $('.overlay')[0] || e.target == $(e.target).closest('.fechar').find('svg')[0]) {
            closeModal()
        }
    })

    $('[data-vitrine]').on('click', '#btn-cart', function (e) {
        if ($(e.currentTarget).closest('[data-vitrine] .modal .button')) {
            addToCartOnModal(e)
        } else if ($(e.currentTarget).closest('.content__action')) {
            addToCardOnClick(e, e.currentTarget)
        }
    });

    $('[data-vitrine]').on('click', '[data-track="true"]', function (e) {
        dataTrack(e.currentTarget)
    });

    $('[data-menu-vitrine] li').click(function (e) {
        e.preventDefault()
        var $this = $(this)
        var thisUrl = $(this).children().attr('href')
        !$this.hasClass('active') ? slickLoadAjax($this.closest('.row').find('[data-vitrine]'), $this.data('id-vitrine')) : ''
        $this.addClass('active').siblings().removeClass('active')
        $this.closest('.row').find('[data-button-vitrine]').children('a').attr('href', thisUrl)
    })


    $('[data-vitrine]').on('click', '.img__slider', function (e) {
        openModal(e.currentTarget)
    })

    $('[data-vitrine]').each(function (index, element) {
        var $this = $(this)
        if ($this.data('vitrine').tipo == "mural") {
            dataElement = $this.data('vitrine')
            callCollection(Number(dataElement.id_colecao), Number(dataElement.tamanho_img), Number(dataElement.margin_right), index, element)
        } else {
            $this.addClass($this.data("vitrine").tipo)
            slickLoadAjax($this)
        }

    })

    function checkForChanges() {
        if ($('[data-vitrine] .product__estante').length) {
            $('[data-vitrine].estante figcaption').each(function () {
                var $this = $(this)
                str = $this.find('.discount-cc').text()
                var textSub = str.substring(0, 26)
                $this.outerHeight() > 93 ? $this.find('.discount-cc').text(`${textSub}...`) : $this.find('.discount-cc').text(str)
            })
        } else {
            setTimeout(checkForChanges, 300);
        }
    }

    checkForChanges()
    width = $(window).width()

})

