"use client";

import { useCallback, useRef, useState } from "react";
import { cn } from "../../../lib/utils";

type WorkStatus = {
  status: "idle" | "working" | "error" | "success";
  message?: string;
};

export default function EditRoutesByFile({
  onParse,
}: {
  onParse: (data: Record<string, string>[]) => unknown;
}) {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | undefined>(undefined);
  const [status, setStatus] = useState<WorkStatus>({ status: "idle" });
  const [isDragging, setIsDragging] = useState(false);
  const workerRef = useRef<Worker | null>(null);
  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      if (status.status === "working") return;
      if (file !== undefined) {
        const res = confirm(
          "Are you sure you want to replace the current file?",
        );
        if (!res) return;
      }
      if (e.dataTransfer.files.length !== 1)
        return setStatus({
          status: "error",
          message: "Please upload one CSV file",
        });
      setFile(e.dataTransfer.files[0]);
    },
    [file, status.status],
  );

  const handleParse = useCallback(() => {
    if (!file || status.status === "working") return;
    if (file.type !== "text/csv") {
      return setStatus({
        status: "error",
        message: "Please upload a CSV file",
      });
    }
    if (!workerRef.current) {
      workerRef.current = new Worker(
        new URL("../../_workers/parseCSV.worker.ts", import.meta.url),
      );

      workerRef.current.onmessage = (event: MessageEvent) => {
        if (event.data instanceof Error) {
          setStatus({ status: "error", message: event.data.message });
          return;
        }
        setStatus({ status: "success" });
        onParse(event.data as unknown as Record<string, string>[]);
      };
      workerRef.current.onerror = (event: ErrorEvent) => {
        setStatus({ status: "error", message: event.message });
      };
    }
    setStatus({ status: "working" });
    workerRef.current.postMessage(file);
  }, [file, onParse, status.status]);

  return (
    <div
      className={cn(
        " bg-item-background flex h-40 w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-700",
        isDragging ? " border-blue-500 bg-blue-100" : "",
      )}
      onDrop={handleDrop}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
    >
      <label className=" text-lg" htmlFor="csv-file">
        Parse CSV File
      </label>
      <input
        ref={inputFileRef}
        type="file"
        className=" hidden"
        onChange={(e) => {
          if (status.status === "working")
            return alert(
              "Please wait for the current file to finish processing",
            );
          if (e.target.files?.length !== 1)
            return setStatus({
              status: "error",
              message: "Please upload one CSV file",
            });
          if (file !== undefined) {
            const res = confirm(
              "Are you sure you want to replace the current file?",
            );
            if (!res) return;
          }
          setFile(e.target.files?.[0]);
        }}
      />
      {file ? (
        <p className=" text-sm text-gray-500">
          {file.name} ({file.size} bytes)
        </p>
      ) : (
        <p className=" opacity-50">No File Selected</p>
      )}
      <div className=" flex flex-row gap-2">
        <button
          className=" bg-item-background rounded-md border-2 border-blue-500 px-6 py-3 font-bold text-blue-500"
          onClick={() => inputFileRef.current?.click()}
        >
          Choose File
        </button>
        <button
          className=" rounded-md bg-blue-500 px-6 py-3 font-bold text-white disabled:opacity-50"
          onClick={handleParse}
          disabled={status.status === "working" || !file}
        >
          {status.status === "working" ? "Working..." : "Parse File"}
        </button>
      </div>
    </div>
  );
}
