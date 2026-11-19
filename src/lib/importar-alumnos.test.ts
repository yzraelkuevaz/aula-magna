import { describe, expect, it } from "vitest";
import { parseNombresAlumnos } from "./importar-alumnos";

describe("parseNombresAlumnos", () => {
  it("toma la primera columna y omite encabezado", () => {
    expect(parseNombresAlumnos("Nombre,Edad\nAna López,8\nLuis Pérez,9")).toEqual(["Ana López", "Luis Pérez"]);
  });
  it("quita numeración y duplicados", () => {
    expect(parseNombresAlumnos("1. Ana\n2) Ana\n3 Beto")).toEqual(["Ana", "Beto"]);
  });
});
