"use client";
import { useForm, useFieldArray } from "react-hook-form";
import { useState } from "react";
import Image from "next/image";
import logoImage from "../../../public/bglock.png";
import Link from "next/link";

export default function Timer() {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      times: [
        { start: "", end: "" },
        { start: "", end: "" },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "times",
  });

  const [totalHours, setTotalHours] = useState(0);

  const watchTimes = watch("times");

  const parseTime = (timeStr) => {
    const hours = parseInt(timeStr.substring(0, 2), 10);
    const minutes = parseInt(timeStr.substring(2, 4), 10);
    return new Date(1970, 0, 1, hours, minutes);
  };

  const calculateTotalHours = (times) => {
    return times.reduce((acc, curr) => {
      const start = parseTime(curr.start);
      const end = parseTime(curr.end);

      if (end < start) {
        end.setDate(end.getDate() + 1);
      }

      const diff = (end - start) / (1000 * 60 * 60);
      return acc + diff;
    }, 0);
  };

  const calculateHours = (data) => {
    const total = calculateTotalHours(data.times);
    setTotalHours(total);
  };

  const calculateCurrentIntervalHours = (start, end) => {
    if (!start || !end) return 0;

    const startTime = parseTime(start);
    const endTime = parseTime(end);

    if (endTime < startTime) {
      endTime.setDate(endTime.getDate() + 1);
    }

    const diff = (endTime - startTime) / (1000 * 60 * 60);
    return diff;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-lg">
        <Image src={logoImage} alt="BGLOCK" width={100} height={100} />
        <h1 className="text-2xl font-bold mb-4 text-gray-700">
          羅の時間計算器
        </h1>
        <form onSubmit={handleSubmit(calculateHours)}>
          {fields.map((item, index) => {
            const start = watchTimes[index]?.start || "";
            const end = watchTimes[index]?.end || "";
            const currentHours = calculateCurrentIntervalHours(start, end);

            return (
              <div key={item.id} className="mb-4 flex items-center">
                <input
                  type="text"
                  placeholder="開始時間"
                  {...register(`times.${index}.start`, {
                    pattern: {
                      value: /^[0-9]{4}$/,
                      message: "請輸入四個數字",
                    },
                    required: "此欄位為必填",
                  })}
                  className={`mr-2 p-2 border rounded w-1/3 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors?.times?.[index]?.start ? "border-red-500" : ""
                  }`}
                />
                {errors?.times?.[index]?.start && (
                  <span className="text-red-500 text-sm">
                    {errors.times[index].start.message}
                  </span>
                )}
                <input
                  type="text"
                  placeholder="結束時間"
                  {...register(`times.${index}.end`, {
                    pattern: {
                      value: /^[0-9]{4}$/,
                      message: "請輸入四個數字",
                    },
                    required: "此欄位為必填",
                  })}
                  className={`ml-2 p-2 border rounded w-1/3 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors?.times?.[index]?.end ? "border-red-500" : ""
                  }`}
                />
                {errors?.times?.[index]?.end && (
                  <span className="text-red-500 text-sm">
                    {errors.times[index].end.message}
                  </span>
                )}
                <span className="ml-4 w-1/4 text-right text-gray-700">
                  {currentHours.toFixed(2)} 小時
                  {currentHours > 16 && (
                    <p className="text-red-500">要再次確認看看!?</p>
                  )}
                </span>

                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="ml-4 text-red-500 hover:text-red-700"
                >
                  &times;
                </button>
              </div>
            );
          })}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => append({ start: "", end: "" })}
              className="border border-blue-500 text-blue-500 px-4 py-2 rounded hover:bg-blue-500 hover:text-white transition duration-200"
            >
              新增時段
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200"
            >
              加總
            </button>
          </div>
        </form>
        <div className="mt-4 text-xl text-gray-700">
          總時數: <span className="font-bold">{totalHours.toFixed(2)}</span>
        </div>
        {/* 搞笑 */}
        <div className={"mt-4 flex items-center gap-2"}>
          <button
            onClick={() => {
              alert("看甚麼看趕快算時間==");
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200"
          >
            點我看看
          </button>

          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200">
            <Link
              href={"https://www.instagram.com/handsometonychacha/"}
              rel="noopener"
              target="_"
            >
              羅のIG
            </Link>
          </button>
        </div>
      </div>
    </div>
  );
}
