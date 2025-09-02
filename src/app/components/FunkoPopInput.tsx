"use client";

import { FunkoInputProps } from "../Types/FunkoPopTypes";

function FunkoInput({ form, onChange }: FunkoInputProps) {
  return (
    <>
      <input
        name="name"
        type="text"
        placeholder="Funko Pop Name"
        value={form.name}
        onChange={onChange}
        required
        className="border px-3 py-2 rounded"
      />
      <input
        name="boughtPrice"
        type="number"
        placeholder="Bought Price (kr)"
        value={form.boughtPrice}
        onChange={onChange}
        className="border px-3 py-2 rounded"
      />
      <input
        name="dateBought"
        type="date"
        value={form.dateBought}
        onChange={onChange}
        className="border px-3 py-2 rounded"
      />
      <input
        name="marketBought"
        type="text"
        placeholder="Market Bought"
        value={form.marketBought}
        onChange={onChange}
        className="border px-3 py-2 rounded"
      />

      <label className="flex items-center gap-2 mt-2">
        <input
          type="checkbox"
          name="isSold"
          checked={form.isSold}
          onChange={onChange}
        />
        Sold now
      </label>

      {form.isSold && (
        <>
          <input
            name="soldPrice"
            type="number"
            placeholder="Sold Price (kr)"
            value={form.soldPrice}
            onChange={onChange}
            className="border px-3 py-2 rounded"
          />
          <input
            name="dateSold"
            type="date"
            value={form.dateSold}
            onChange={onChange}
            className="border px-3 py-2 rounded"
          />
          <input
            name="marketSold"
            type="text"
            placeholder="Market Sold"
            value={form.marketSold}
            onChange={onChange}
            className="border px-3 py-2 rounded"
          />
        </>
      )}

      <div className="flex gap-4 mt-2">
        <label>
          <input
            type="radio"
            name="transport"
            value="drive"
            checked={form.transport === "drive"}
            onChange={onChange}
          />
          Drove
        </label>
        <label>
          <input
            type="radio"
            name="transport"
            value="shipping"
            checked={form.transport === "shipping"}
            onChange={onChange}
          />
          Shipping
        </label>
      </div>

      {form.transport === "drive" && (
        <>
          <input
            name="petrolCost"
            type="number"
            placeholder="Petrol cost (kr)"
            value={form.petrolCost}
            onChange={onChange}
            className="border px-3 py-2 rounded"
          />
          <input
            name="fromAddress"
            type="text"
            placeholder="From address"
            value={form.fromAddress}
            onChange={onChange}
            className="border px-3 py-2 rounded"
          />
          <input
            name="toAddress"
            type="text"
            placeholder="To address"
            value={form.toAddress}
            onChange={onChange}
            className="border px-3 py-2 rounded"
          />
        </>
      )}

      {form.transport === "shipping" && (
        <input
          name="petrolCost"
          type="number"
          placeholder="Shipping cost (kr)"
          value={form.petrolCost}
          onChange={onChange}
          className="border px-3 py-2 rounded"
        />
      )}

      <input
        name="extra"
        type="text"
        placeholder="Extra (voucher, etc.)"
        value={form.extra}
        onChange={onChange}
        className="border px-3 py-2 rounded"
      />
      <input
        name="totalCost"
        type="number"
        placeholder="Total cost (kr)"
        value={form.totalCost}
        onChange={onChange}
        className="border px-3 py-2 rounded"
      />
      <input
        name="imageUrl"
        type="text"
        placeholder="Image URL"
        value={form.imageUrl}
        onChange={onChange}
        className="border px-3 py-2 rounded"
      />
    </>
  );
}

export default FunkoInput;
