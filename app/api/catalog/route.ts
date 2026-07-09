import { NextResponse } from "next/server";
import { catalog as fallbackCatalog, defaultCatalogCsvUrl, parseCatalogCsv } from "../../catalog-data";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const response = await fetch(defaultCatalogCsvUrl, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Failed to load sheet CSV: ${response.status}`);
    }

    const csvText = await response.text();
    const catalog = parseCatalogCsv(csvText);

    return NextResponse.json(
      {
        source: "sheet",
        updatedAt: new Date().toISOString(),
        catalog: catalog.length > 0 ? catalog : fallbackCatalog,
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  } catch (error) {
    return NextResponse.json(
      {
        source: "fallback",
        updatedAt: new Date().toISOString(),
        error: error instanceof Error ? error.message : "Unknown error",
        catalog: fallbackCatalog,
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  }
}
