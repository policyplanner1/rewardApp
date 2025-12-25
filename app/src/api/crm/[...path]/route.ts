import { NextResponse } from "next/server";
const API_BASE_URL = "http://localhost:5000/api";

async function handler(req: Request, method: string, params: any) {
  const token = req.headers.get("authorization");
  const body = method !== "GET" ? await req.json() : undefined;

  const target = `${API_BASE_URL}/${params.path.join("/")}`;

  const res = await fetch(target, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: token } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export const GET = (req: Request, ctx: any) => handler(req, "GET", ctx.params);
export const POST = (req: Request, ctx: any) => handler(req, "POST", ctx.params);
export const PUT = (req: Request, ctx: any) => handler(req, "PUT", ctx.params);
export const PATCH = (req: Request, ctx: any) => handler(req, "PATCH", ctx.params);
export const DELETE = (req: Request, ctx: any) => handler(req, "DELETE", ctx.params);
