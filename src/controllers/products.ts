import { v4 } from 'https://deno.land/std/uuid/mod.ts';
import { Product } from "../types.ts";

let products: Product[] = [];

["One", "Two", "Three", "Four", "Five"].forEach((e, i) => {
    let product: Product = {
        id: `${v4.generate()}`,
        name: `Product ${e}`,
        description: `This is the product ${e.toLowerCase()}`,
        price: (i + 1) * 9.99,
    };
    products.push(product);
});

// Default responses
const productNotFoundResponse = (response: any) => {
    response.status = 404;
    response.body = {
        success: false,
        msg: 'No product found',
    };
}

const noDataRequestResponse = (response: any) => {
    response.status = 404;
    response.body = {
        success: false,
        msg: 'No data',
    };
}

const validResponse = ( response : any, data: Product[] | Product ,  msg: string = '', status_code: number = 200,) => {
    response.status = status_code;
    response.body = {
        success: true,
        data: data,
    };
    if (msg) {
        response.body.msg = msg;
    }
}

const getProducts = ({ response }: { response: any }) => {
    validResponse(response, products);
};

const getProduct = ({ params, response }: { params: { id: string }, response: any }) => {
    const product: Product | undefined = products.find(p => p.id === params.id)

    if(product) {
        validResponse(response, product);
    } else {
        productNotFoundResponse(response);
    }

};

const addProduct = async ({ request, response }: { request: any, response: any }) => {
    const body = await request.body();

    if (!request.hasBody) {
        noDataRequestResponse(response);
    } else {
        const product: Product = body.value;
        product.id = v4.generate();
        products.push(product);

        validResponse(response, product, '', 201);
    }
};

const updateProduct = async ({ request, params, response }: { request: any, params: { id: string }, response: any }) => {
    const product: Product | undefined = products.find(p => p.id === params.id);

    if (!product) {
        productNotFoundResponse(response);
    } else if (!request.hasBody) {
        noDataRequestResponse(response);
    } else {
        const body = await request.body();
        const updateData: { name?: string; description?: string; price?:number } = body.value;
        products = products.map(p => p.id === params.id ? {...p, ...updateData} : p);

        validResponse(response, products);
    }
};

const deleteProduct = ({ params, response }: { params: { id: string }, response: any }) => {
    const product: Product | undefined = products.find(p => p.id === params.id);

    if (!product) {
        productNotFoundResponse(response);
    } else {
        products = products.filter(p => p.id !== params.id);

        validResponse(response, products, `The product with id ${params.id} has been deleted`);
    }
};

export { getProducts, getProduct, addProduct, updateProduct, deleteProduct };