#!/usr/bin/env swift
import AppKit
import CoreGraphics

let size = 1024
let canvas = NSSize(width: size, height: size)

let image = NSImage(size: canvas)
image.lockFocus()

guard let ctx = NSGraphicsContext.current?.cgContext else { exit(1) }

// Background: rounded rect with teal gradient
let cornerRadius: CGFloat = 220
let bgPath = CGPath(roundedRect: CGRect(x: 0, y: 0, width: 1024, height: 1024),
                    cornerWidth: cornerRadius, cornerHeight: cornerRadius, transform: nil)
ctx.addPath(bgPath)
ctx.clip()

// Gradient background: dark teal to lighter teal
let colors = [
  CGColor(red: 0.02, green: 0.55, blue: 0.55, alpha: 1.0),
  CGColor(red: 0.10, green: 0.72, blue: 0.72, alpha: 1.0),
] as CFArray
let gradient = CGGradient(colorsSpace: CGColorSpaceCreateDeviceRGB(),
                           colors: colors, locations: [0.0, 1.0])!
ctx.drawLinearGradient(gradient,
  start: CGPoint(x: 0, y: 0),
  end: CGPoint(x: 1024, y: 1024),
  options: [])

// Inner circle (white, semi-transparent)
ctx.setFillColor(CGColor(red: 1, green: 1, blue: 1, alpha: 0.12))
ctx.fillEllipse(in: CGRect(x: 112, y: 112, width: 800, height: 800))

// Draw broom handle
ctx.saveGState()
ctx.setStrokeColor(CGColor(red: 1, green: 1, blue: 1, alpha: 0.95))
ctx.setLineCap(.round)
ctx.setLineWidth(52)
ctx.move(to: CGPoint(x: 680, y: 760))
ctx.addLine(to: CGPoint(x: 340, y: 280))
ctx.strokePath()
ctx.restoreGState()

// Broom head (white filled triangle/ellipse at bottom-right of handle)
ctx.saveGState()
ctx.translateBy(x: 688, y: 748)
ctx.rotate(by: -.pi / 4)
let headRect = CGRect(x: -110, y: -48, width: 220, height: 96)
ctx.setFillColor(CGColor(red: 1, green: 1, blue: 1, alpha: 1.0))
let headPath = CGPath(roundedRect: headRect, cornerWidth: 48, cornerHeight: 48, transform: nil)
ctx.addPath(headPath)
ctx.fillPath()
// Bristle lines
ctx.setStrokeColor(CGColor(red: 0.02, green: 0.55, blue: 0.55, alpha: 0.6))
ctx.setLineWidth(10)
ctx.setLineCap(.round)
for i in 0..<5 {
  let x = -80.0 + Double(i) * 40.0
  ctx.move(to: CGPoint(x: x, y: 10))
  ctx.addLine(to: CGPoint(x: x - 14, y: 60))
  ctx.strokePath()
}
ctx.restoreGState()

// Sparkle dots (cleaning effect)
let sparkles: [(CGFloat, CGFloat, CGFloat)] = [
  (290, 680, 28),
  (220, 580, 18),
  (370, 730, 16),
  (240, 720, 12),
]
ctx.setFillColor(CGColor(red: 1, green: 1, blue: 1, alpha: 0.85))
for (x, y, r) in sparkles {
  ctx.fillEllipse(in: CGRect(x: x - r/2, y: y - r/2, width: r, height: r))
}

image.unlockFocus()

// Save as PNG
guard let tiffData = image.tiffRepresentation,
      let bitmap = NSBitmapImageRep(data: tiffData),
      let pngData = bitmap.representation(using: .png, properties: [:]) else {
  print("Failed to create PNG")
  exit(1)
}

let outputPath = CommandLine.arguments.count > 1 ? CommandLine.arguments[1] : "icon_1024.png"
do {
  try pngData.write(to: URL(fileURLWithPath: outputPath))
  print("Saved: \(outputPath)")
} catch {
  print("Error: \(error)")
  exit(1)
}
