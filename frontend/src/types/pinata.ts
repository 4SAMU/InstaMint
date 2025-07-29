export interface PinataConfig {
  pinataJwt?: string;
  pinataGateway?: string;
}

export interface FileUploadResponse {
  cid: string;
  ipfsHash: string;
  pinSize: number;
  timestamp: string;
}

export interface SignedUrlResponse {
  url: string;
  expiration: string;
}

export interface GatewayResponse {
  url: string;
}
