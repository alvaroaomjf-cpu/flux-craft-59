import type { FlowFile, FlowValidationResult } from "./types";
import { normalizeFlowFile } from "./normalization";

export function validateFlowFile(input: unknown): FlowValidationResult {
  return normalizeFlowFile(input);
}

export function assertValidFlowFile(input: unknown): FlowFile {
  const result = validateFlowFile(input);
  if (!result.ok || !result.file) {
    throw new Error(result.error ?? "Arquivo .flow.json inválido.");
  }
  return result.file;
}

export function isFlowFile(input: unknown): input is FlowFile {
  return validateFlowFile(input).ok;
}
