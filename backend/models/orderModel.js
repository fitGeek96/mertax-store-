import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderItems: [
      {
        name: {
          type: String,
        },
        price: {
          type: Number,
        },
        qty: {
          type: Number,
        },
        image: {
          type: String,
        },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
      },
    ],
    shippingAddress: {
      fullname: {
        type: String,
      },
      phone: {
        type: String,
      },
      address: {
        type: String,
      },
      city: {
        type: String,
      },
      // state: {
      //   type: String,
      // },
      // zipcode: {
      //   type: Number,
      // },
      // country: {
      //   type: String,
      //   required: true
      // },
    },
    paymentMethod: {
      type: String,
    },
    paymentResult: {
      id: {
        type: String,
      },
      status: {
        type: String,
      },
      update_time: {
        type: String,
      },
      email_address: {
        type: String,
      },
    },
    itemsPrice: {
      type: Number,
      default: 0.0,
    },
    shippingPrice: {
      type: Number,
      default: 0.0,
    },
    totalPrice: {
      type: Number,
      default: 0.0,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    paidAt: {
      type: Date,
      default: Date.now,
    },
    isDelivered: {
      type: Boolean,
      default: false,
    },
    deliveredAt: {
      type: Date,
      default: Date.now,
    },
    //   taxPrice: {
    //     type: Number,
    //     required: true
    //     default: 0.0
    //   }
  },
  {
    timestamps: true,
  },
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
