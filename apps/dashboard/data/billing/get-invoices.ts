import "server-only";

// Simple stub - invoices can be viewed directly in Polar customer portal
export async function getInvoices(): Promise<never[]> {
	return [];
}
