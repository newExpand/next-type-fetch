import { describe, expect, it, vi } from "vitest";
import { isEmptyObject, stringifyData } from "../src/utils/data";

describe("next-type-fetch: 데이터 유틸리티", () => {
	describe("isEmptyObject 함수", () => {
		it("빈 객체 확인", () => {
			expect(isEmptyObject({})).toBe(true);
		});

		it("값이 있는 객체 확인", () => {
			expect(isEmptyObject({ key: "value" })).toBe(false);
		});

		it("undefined 확인", () => {
			expect(isEmptyObject(undefined)).toBe(true);
		});

		it("null 확인", () => {
			// @ts-expect-error - 타입 오류를 무시하고 실제 함수 동작 테스트
			expect(isEmptyObject(null)).toBe(true);
		});
	});

	describe("stringifyData 함수", () => {
		it("객체를 JSON 문자열로 변환", () => {
			const data = { name: "Test", value: 123 };
			expect(stringifyData(data)).toBe('{"name":"Test","value":123}');
		});

		it("문자열 데이터는 그대로 반환", () => {
			const data = "이미 문자열";
			expect(stringifyData(data)).toBe(data);
		});

		it("null 데이터는 null 반환", () => {
			expect(stringifyData(null)).toBeNull();
		});

		it("undefined 데이터는 null 반환", () => {
			expect(stringifyData(undefined)).toBeNull();
		});

		it("JSON 변환 실패 시 null 반환 및 에러 로깅", () => {
			// 순환 참조 객체 생성
			const circularObj: Record<string, unknown> = {};
			circularObj.self = circularObj;

			// console.error 모킹
			const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

			// 순환 참조 객체를 JSON으로 변환 시도
			const result = stringifyData(circularObj);

			// 결과 검증
			expect(result).toBeNull();
			expect(consoleSpy).toHaveBeenCalledTimes(1);
			expect(consoleSpy.mock.calls[0][0]).toBe("Failed to stringify data:");

			// 모킹 복원
			consoleSpy.mockRestore();
		});
	});
});
