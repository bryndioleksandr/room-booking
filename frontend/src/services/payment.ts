import api from "./axios";

type ForcedPaymentStatus = "success" | "failed";

export interface TestRoomPaymentData {
    roomId: number;
    userId: number;
    startTime: string | Date;
    endTime: string | Date;
    forceStatus?: ForcedPaymentStatus;
}

export interface TestRoomPaymentResponse {
    msg: string;
    status: ForcedPaymentStatus;
    transactionId: string;
    amount: number;
    currency: string;
}

export const testRoomPayment = async (
    payload: TestRoomPaymentData
): Promise<TestRoomPaymentResponse> => {
    const { data } = await api.post("/payments/test-charge", payload);
    return data;
};
