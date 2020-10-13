import graphql from 'graphql';
import Product from '../models/Product.js';
import ProductGroup from '../models/ProductGroup.js';

import ProductGroupType from './ProductGroupType.js';
import ProductType from './ProductType.js';

const {GraphQLID, GraphQLObjectType, GraphQLList} = graphql;


const RootQueryType = new GraphQLObjectType({
    name: 'RootQuery',
    fields: {
        //Obtener un producto por id
        product: {
            type: ProductType,
            args: {id: {type: GraphQLID}},
            resolve(parent, args){
                return Product.findById(args.id);
            }
        },
        //Obrtener la lista de productos
        products: {
            type: new GraphQLList(ProductType),
            resolve(parent, args){
                return Product.find();
            }
        },
        getProductsByGroupId:{
            type: new GraphQLList(ProductType),
            args: {groupId: {type: GraphQLID}},
            resolve(parent, args){
                return Product.find({productGroupId: args.groupId});
            }
        },
        productGroup: {
            type: ProductGroupType,
            args: {id: {type: GraphQLID}},
            resolve(parent, args){
                return ProductGroup.findById(args.id);
            }
        },
        productGroups: {
            type: new GraphQLList(ProductGroupType),
            resolve(parent, args){
                return ProductGroup.find();
            }
        }
    }
});

export default RootQueryType;