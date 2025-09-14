import "./scss/styles.scss";
import { Api } from "./components/base/Api";
import { API_URL } from "./utils/constants";
import { Server } from "./components/models/Server";
import { EventEmitter } from "./components/base/Events";

import { Products } from "./components/models/Products";
import { Basket } from "./components/models/Basket";
import { CustomerInfo } from "./components/models/CustomerInfo";

import { Header } from "./components/views/Header";
import { Gallery } from "./components/views/Gallery";
import { ModalWindow } from "./components/views/ModalWindow";
import { BasketView } from "./components/views/BasketView";
import { SuccessedOrder } from "./components/views/SuccessedOrder";
import { OrderForm, ContactForm } from "./components/views/Form";
import {
  CatalogCard,
  PreviewCard,
  BasketCard,
} from "./components/views/ItemCard";
import { IItem, OrderRequest, OrderResponse } from "./types";

async function serverRequest() {
  const events = new EventEmitter();

  const api = new Api(API_URL);
  const server = new Server(api);

  const productsModel = new Products(events);
  const basketModel = new Basket(events);
  const customerInfoModel = new CustomerInfo(events);

  const templateCatalog =
    document.querySelector<HTMLTemplateElement>("#card-catalog")!;
  const templatePreview =
    document.querySelector<HTMLTemplateElement>("#card-preview")!;
  const templateCardBasket =
    document.querySelector<HTMLTemplateElement>("#card-basket")!;
  const templateBasket =
    document.querySelector<HTMLTemplateElement>("#basket")!;
  const templateOrder = document.querySelector<HTMLTemplateElement>("#order")!;
  const templateContacts =
    document.querySelector<HTMLTemplateElement>("#contacts")!;
  const templateSuccess =
    document.querySelector<HTMLTemplateElement>("#success")!;

  const cloneCatalog = () =>
    (templateCatalog.content.firstElementChild as HTMLElement).cloneNode(
      true
    ) as HTMLElement;
  const clonePreview = () =>
    (templatePreview.content.firstElementChild as HTMLElement).cloneNode(
      true
    ) as HTMLElement;
  const cloneCardBasket = () =>
    (templateCardBasket.content.firstElementChild as HTMLElement).cloneNode(
      true
    ) as HTMLElement;
  const cloneBasket = () =>
    (templateBasket.content.firstElementChild as HTMLElement).cloneNode(
      true
    ) as HTMLElement;
  const cloneOrder = () =>
    (templateOrder.content.firstElementChild as HTMLFormElement).cloneNode(
      true
    ) as HTMLFormElement;
  const cloneContacts = () =>
    (templateContacts.content.firstElementChild as HTMLFormElement).cloneNode(
      true
    ) as HTMLFormElement;
  const cloneSuccess = () =>
    (templateSuccess.content.firstElementChild as HTMLElement).cloneNode(
      true
    ) as HTMLElement;

  const headerView = new Header(
    events,
    document.querySelector(".header") as HTMLElement
  );
  const galleryView = new Gallery(
    document.querySelector(".gallery") as HTMLElement
  );
  const modalWindowView = new ModalWindow(
    events,
    document.querySelector(".modal") as HTMLElement
  );
  const basketView = new BasketView(events, cloneBasket());

  events.on("productsData:changed", () => {
    const cards: HTMLElement[] = productsModel.getItems().map((item) => {
      const el = cloneCatalog();
      el.dataset.id = item.id;
      const card = new CatalogCard(events, el);
      card.render({
        title: item.title,
        price: item.price,
        image: item.image,
        category: item.category,
      });
      return card.render();
    });
    galleryView.catalogItems = cards;
  });

  events.on("modalWindowButton:close", () => {
    modalWindowView.render({ opened: false });
  });

  events.on<{ id: string }>("itemToPreview:open", ({ id }) => {
    const item = productsModel.getItemById(id);
    if (item) productsModel.setCurrentItem(item);
  });

  let currentPreview: PreviewCard | null = null;
  let currentPreviewId: string | null = null;

  events.on("productPreview:changed", () => {
    const item = productsModel.getCurrentItem();
    if (!item) return;

    const el = clonePreview();
    el.dataset.id = item.id;
    const preview = new PreviewCard(events, el);

    const itemCanBuy = item.price !== null;
    const itemInBasket = basketModel.basketHasItem(item.id);

    preview.render({
      title: item.title,
      price: item.price,
      image: item.image,
      category: item.category,
      text: item.description,
      buttonText: itemCanBuy
        ? itemInBasket
          ? "Удалить из корзины"
          : "В корзину"
        : "Недоступно",
      disabled: !itemCanBuy,
    });
    modalWindowView.render({ content: preview.render(), opened: true });
    currentPreview = preview;
    currentPreviewId = item.id;
  });

  events.on<{ id: string }>("itemToBuy:pushed", ({ id }) => {
    const item = productsModel.getItemById(id);
    if (!item) return;

    const itemCanBuy = item.price !== null;
    if (itemCanBuy) {
      if (basketModel.basketHasItem(id)) basketModel.removeBItem(item);
      else basketModel.addBItem(item);
    }

    if (currentPreview && currentPreviewId === id) {
      if (!itemCanBuy) {
        currentPreview.disabled = true;
        currentPreview.buttonText = "Недоступно";
      } else {
        currentPreview.disabled = false;
        currentPreview.buttonText = basketModel.basketHasItem(id)
          ? "Удалить из корзины"
          : "В корзину";
      }
    }
  });

  const buildBasket = (): HTMLElement[] =>
    basketModel.getBItems().map((item, index) => {
      const el = cloneCardBasket();
      el.dataset.id = item.id;
      const card = new BasketCard(events, el);
      card.render({
        title: item.title,
        price: item.price,
        index: String(index + 1),
      });
      return card.render();
    });

  events.on("basketButton:open", () => {
    basketView.basketContent = buildBasket();
    basketView.basketPrice = basketModel.getBTotalPrice();
    if (basketModel.getBCount() === 0) {
      basketView.disabled = true;
      basketView.basketContent = "Корзина пуста";
    } else {
      basketView.disabled = false;
    }
    modalWindowView.render({ content: basketView.render(), opened: true });
  });

  events.on("basketData:changed", () => {
    headerView.count = basketModel.getBCount();
    basketView.basketContent = buildBasket();
    basketView.basketPrice = basketModel.getBTotalPrice();
    if (basketModel.getBCount() === 0) {
      basketView.disabled = true;
      basketView.basketContent = "Корзина пуста";
    } else {
      basketView.disabled = false;
    }
  });

  events.on<{ id: string }>("itemRemoveBasket:pushed", ({ id }) => {
    const item = basketModel.getBItems().find((i) => i.id === id);
    if (!item) return;
    basketModel.removeBItem(item);
  });

  const buildSuccessedOrder = (total: number): HTMLElement => {
    const successedOrderView = new SuccessedOrder(events, cloneSuccess());
    successedOrderView.price = total ?? basketModel.getBTotalPrice();
    return successedOrderView.render();
  };

  events.on<{ field: "payment" | "address"; value: any }>(
    "order:changed",
    ({ field, value }) => customerInfoModel.setField(field, value)
  );

  events.on<{ field: "email" | "phone"; value: any }>(
    "contacts:changed",
    ({ field, value }) => customerInfoModel.setField(field, value)
  );

  let currentForm: OrderForm | ContactForm | null = null;

  function syncFormFromModel() {
    if (currentForm instanceof OrderForm) {
      const payment = customerInfoModel.getField("payment");
      const address = customerInfoModel.getField("address");

      currentForm.payment = payment;
      currentForm.address = address;

      const paymentValid = customerInfoModel.validateField("payment");
      const addressValid = customerInfoModel.validateField("address");

      currentForm.error = !paymentValid
        ? "Выберите способ оплаты"
        : !addressValid
        ? "Укажите адрес доставки"
        : "";
      currentForm.disabled = !(paymentValid && addressValid);
    }

    if (currentForm instanceof ContactForm) {
      const email = customerInfoModel.getField("email");
      const phone = customerInfoModel.getField("phone");

      currentForm.email = email;
      currentForm.phone = phone;

      const emailValid = customerInfoModel.validateField("email");
      const phoneValid = customerInfoModel.validateField("phone");

      currentForm.error = !emailValid
        ? "Некорректный email"
        : !phoneValid
        ? "Некорректный телефон"
        : "";
      currentForm.disabled = !(emailValid && phoneValid);
    }
  }

  events.on("customerInfoData:changed", () => {
    syncFormFromModel();
  });

  events.on("orderButton:made", () => {
    const orderF = new OrderForm(events, cloneOrder());
    currentForm = orderF;
    modalWindowView.render({
      content: orderF.render({ error: "", disabled: true }),
      opened: true,
    });
    syncFormFromModel();
  });

  events.on("submitButton:submit", async () => {
    const modal = document.querySelector(".modal") as HTMLElement;

    if (modal.querySelector('form[name="order"]')) {
      const orderFValid =
        customerInfoModel.validateField("payment") &&
        customerInfoModel.validateField("address");
      if (!orderFValid) return;
      const conctactsF = new ContactForm(events, cloneContacts());
      currentForm = conctactsF;
      modalWindowView.render({
        content: conctactsF.render({ error: "", disabled: true }),
      });
      syncFormFromModel();
      return;
    }

    if (modal.querySelector('form[name="contacts"]')) {
      const conctactsFValid =
        customerInfoModel.validateField("email") &&
        customerInfoModel.validateField("phone");
      if (!conctactsFValid) return;

      try {
        const payload: OrderRequest = {
          payment: customerInfoModel.getField("payment"),
          email: customerInfoModel.getField("email"),
          phone: customerInfoModel.getField("phone"),
          address: customerInfoModel.getField("address"),
          items: basketModel.getBItems().map((i) => i.id),
          total: basketModel.getBTotalPrice(),
        };

        const res: OrderResponse = await server.createOrder(payload);
        modalWindowView.render({
          content: buildSuccessedOrder(res.total),
          opened: true,
        });
      } catch (err) {
        console.error("Ошибка при создании заказа:", err);
      }
      return;
    }
  });

  events.on("toNewPurchasesButton:go", () => {
    modalWindowView.render({ opened: false });
    basketModel.clearBasket();
    customerInfoModel.clearCustomerInfo();
  });

  const serverItems = await server.getProducts();
  productsModel.setItems(serverItems as IItem[]);
}

serverRequest().catch(console.error);
