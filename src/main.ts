import './scss/styles.scss';
import { apiProducts } from './utils/data';
import { Api } from "./components/base/Api";
import { Server } from "./components/models/Server";
import type { IItem } from "./types";


import { Products } from './components/models/Products';
import { Basket } from './components/models/Basket';
import { CustomerInfo } from './components/models/CustomerInfo';


const productsModel = new Products();
productsModel.setItems(apiProducts.items);

console.log(`Массив товаров из каталога: `, productsModel.getItems());


const basketModel = new Basket();
const [item1, item2] = productsModel.getItems();

basketModel.addBItem(item1);
basketModel.addBItem(item2);
console.log("В корзине находится", basketModel.getBItems().map(i => i.title));
basketModel.removeBItem(item1);
console.log("После удаления item1 в корзине находится", basketModel.getBItems().map(i => i.title));
console.log("В корзине предметов", basketModel.getBCount());
console.log("Общая стоимость: ", basketModel.getBTotalPrice());
console.log("Проверка нахождения item1", basketModel.basketHasItem(item1.id));
basketModel.clearBasket();
console.log("После очистки корзины в ней находится ", basketModel.getBItems().length);


const customerModel = new CustomerInfo();

customerModel.setCData({
  payment: "Онлайн",
  email: "test@example.com",
  phone: "+1 (11) 111-11-11",
  address: "city M",
});
console.log("Все данные покупателя:", customerModel.getCData());
customerModel.setField("email", "test2@example");
console.log("Обновлен email: ", customerModel.getField("email"));
console.log("Валидность email", customerModel.validateField("email"));
console.log("Валидность всех данных: ", customerModel.validateCustomer());


const BASE_URL = import.meta.env.VITE_API_ORIGIN;

async function serverRequest() {
  const api = new Api(BASE_URL);
  const server = new Server(api);
  const productsModel = new Products();
  const serverItems = await server.getProducts();
  productsModel.setItems(serverItems as IItem[]);
  console.log("Каталог c сервера:", productsModel.getItems());
}

serverRequest().catch(console.error);