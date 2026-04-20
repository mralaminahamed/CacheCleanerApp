.PHONY: build test clean lint

build:
	swift build --configuration release

debug:
	swift build --configuration debug

test:
	swift test --configuration debug

clean:
	swift package clean

lint:
	swiftlint lint Sources/ --strict

run:
	swift run CacheCleaner
