import { faker } from '@faker-js/faker';
import fs from 'fs';

const renderCategoryList = (n) => {
  if (typeof n !== 'number' || n <= 0) return [];

  const categoryList = [];

  Array.from(new Array(n)).forEach(() => {
    const categoryObj = {
      id: faker.datatype.uuid(),
      categoryName: faker.commerce.department(),
      createAt: Date.now(),
      updateAt: Date.now(),
    };

    categoryList.push(categoryObj);
  });

  return categoryList;
};

const renderProductList = (categoryList, numberOfProduct) => {
  if (typeof numberOfProduct !== 'number' || numberOfProduct <= 0) return;

  const productList = [];

  categoryList.forEach((category) => {
    Array.from(new Array(numberOfProduct)).forEach(() => {
      const productObj = {
        categoryID: category.id,
        id: faker.datatype.uuid(),
        productName: faker.commerce.productName(),
        productPrice: Number.parseFloat(faker.commerce.price()),
        description: faker.commerce.productDescription(),
        imageUrl: faker.image.imageUrl(),
        color: faker.color.rgb(),
        createAt: Date.now(),
        updateAt: Date.now(),
      };

      productList.push(productObj);
    });
  });

  return productList;
};

// main
(() => {
  // Change language into vietnamese
  faker.locale = 'vi';

  const categoryList = renderCategoryList(4);
  const productList = renderProductList(categoryList, 5);

  const db = {
    categories: categoryList,
    products: productList,
    profile: {
      name: 'Phuc',
    },
  };

  // Write into db.json
  fs.writeFile('./db.json', JSON.stringify(db), () => {
    console.log('Write file into db.json successfully');
  });
})();
