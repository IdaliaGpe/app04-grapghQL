import graphql from 'graphql';
import database from '../database.js';
import Product from '../models/Product.js';

const {products, productGroups} = database;

const {GraphQLID, GraphQLString, GraphQLObjectType, GraphQLSchema, GraphQLList} = graphql;

const ProductType = new GraphQLObjectType({
    name: 'Product',
    fields: ()=>({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        price: {type: GraphQLString},
        productGroup: {
            type: ProductGroupType,
            resolve(parent, args){
                return productGroups.find(pg => pg.id === parent.productGroupId);
            }
        }
    })
});

const ProductGroupType = new GraphQLObjectType({
    name: 'ProductGroup',
    fields: ()=>({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        products: {
            type: new GraphQLList(ProductType),
            resolve(parent, args){
                return products.filter(p => p.productGroupId === parent.id);
            }
        }
    })
});

const RootQueryType = new GraphQLObjectType({
    name: 'RootQuery',
    fields: {
        //Obtener un producto por id
        product: {
            type: ProductType,
            args: {id: {type: GraphQLID}},
            resolve(parent, args){
                return products.find(p => p.id === args.id);
            }
        },
        //Obrtener la lista de productos
        products: {
            type: new GraphQLList(ProductType),
            resolve(parent, args){
                return products;
            }
        },
        getProductsByGroupId:{
            type: new GraphQLList(ProductType),
            args: {groupId: {type: GraphQLID}},
            resolve(parent, args){
                return products.filter(p => p.productGroupId === args.groupId);
            }
        },
        productGroup: {
            type: ProductGroupType,
            args: {id: {type: GraphQLID}},
            resolve(parent, args){
                return productGroups.find(pg => pg.id === args.id);
            }
        },
        productGroups: {
            type: new GraphQLList(ProductGroupType),
            resolve(parent, args){
                return productGroups;
            }
        }
    }
});

const MutationType = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addProduct: {
            type: ProductType,
            args: {
                name: {type: GraphQLString},
                price: {type: GraphQLString},
                productGroupId: {type: GraphQLID}
            },
            resolve(parent, args){
                let newProduct = new Product({
                    name: args.name,
                    price: args.price,
                    productGroupId: args.productGroupId
                });
                products.push(newProduct);

                return newProduct;
            }
        }
    }
});

export default new GraphQLSchema({
    query: RootQueryType,
    mutation: MutationType
});