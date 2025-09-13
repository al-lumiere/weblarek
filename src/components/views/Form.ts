import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { TPayment, IFormBase, IOrderForm, IContactForm } from "../../types";

const activeButton = "button_alt-active";

export class FormBase<T extends IFormBase = IFormBase> extends Component<T> {
  protected submitButton: HTMLButtonElement;
  protected errorForm: HTMLElement;

  constructor(protected events: IEvents, container: HTMLFormElement) {
    super(container);
    this.submitButton = ensureElement<HTMLButtonElement>(
      'button[type="submit"]',
      this.container
    );
    this.errorForm = ensureElement<HTMLElement>(
      ".form__errors",
      this.container
    );

    this.container.addEventListener("submit", (e) => {
      e.preventDefault();
      this.events.emit("submitButton:submit");
    });
  }

  set error(value: string | undefined) {
    this.errorForm.textContent = value ?? "";
  }
  set disabled(value: boolean | undefined) {
    if (value === undefined) return;
    this.submitButton.disabled = value;
  }
}

export class OrderForm extends FormBase<IOrderForm> {
  protected cashButton: HTMLButtonElement;
  protected cardButton: HTMLButtonElement;
  protected addressInput: HTMLInputElement;

  constructor(events: IEvents, container: HTMLFormElement) {
    super(events, container);
    this.cashButton = ensureElement<HTMLButtonElement>(
      'button[name="cash"]',
      this.container
    );
    this.cardButton = ensureElement<HTMLButtonElement>(
      'button[name="card"]',
      this.container
    );
    this.addressInput = ensureElement<HTMLInputElement>(
      'input[name="address"]',
      this.container
    );

    this.cashButton.addEventListener("click", () => {
      this.payment = "При получении" as TPayment;
      this.events.emit("order:changed", {
        field: "payment",
        value: "При получении" as TPayment,
      });
    });
    this.cardButton.addEventListener("click", () => {
      this.payment = "Онлайн" as TPayment;
      this.events.emit("order:changed", {
        field: "payment",
        value: "Онлайн" as TPayment,
      });
    });
    this.container.addEventListener("input", (e) => {
      if (e.target === this.addressInput) {
        this.events.emit("order:changed", {
          field: "address",
          value: this.addressInput.value,
        });
      }
    });
  }

  set address(value: string | undefined) {
    if (value === undefined) return;
    this.addressInput.value = value;
  }
  set payment(value: TPayment | undefined) {
    if (value == null) {
      this.cardButton.classList.remove(activeButton);
      this.cashButton.classList.remove(activeButton);
      return;
    }
    this.cardButton.classList.toggle(activeButton, value === "Онлайн");
    this.cashButton.classList.toggle(activeButton, value === "При получении");
  }
}

export class ContactForm extends FormBase<IContactForm> {
  protected emailInput: HTMLInputElement;
  protected phoneInput: HTMLInputElement;

  constructor(events: IEvents, container: HTMLFormElement) {
    super(events, container);
    this.emailInput = ensureElement<HTMLInputElement>(
      'input[name="email"]',
      this.container
    );
    this.phoneInput = ensureElement<HTMLInputElement>(
      'input[name="phone"]',
      this.container
    );

    this.container.addEventListener("input", (e) => {
      if (e.target === this.emailInput) {
        this.events.emit("contacts:changed", {
          field: "email",
          value: this.emailInput.value,
        });
      }
      if (e.target === this.phoneInput) {
        this.events.emit("contacts:changed", {
          field: "phone",
          value: this.phoneInput.value,
        });
      }
    });
  }

  set email(value: string | undefined) {
    if (value === undefined) return;
    this.emailInput.value = value;
  }
  set phone(value: string | undefined) {
    if (value === undefined) return;
    this.phoneInput.value = value;
  }
}
