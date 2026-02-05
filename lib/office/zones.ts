import type { GridSpec, Rect, Zone, ZoneType } from "@/types";

const createZone = (id: string, type: ZoneType, rect: Rect): Zone => ({
  id,
  type,
  rect,
});

export type ZoneLayoutOptions = {
  margin?: number;
  walkwayWidth?: number;
};

export const generateZones = (
  grid: GridSpec,
  options: ZoneLayoutOptions = {}
): Zone[] => {
  const margin = options.margin ?? 2;
  const walkwayWidth = options.walkwayWidth ?? 2;

  const innerW = Math.max(1, grid.width - margin * 2);
  const innerH = Math.max(1, grid.height - margin * 2);

  const workW = Math.max(1, Math.floor(innerW * 0.6));
  const workH = innerH;

  const rightColumnW = Math.max(1, innerW - workW - walkwayWidth);
  const rightColumnX = margin + workW + walkwayWidth;

  const availableRightH = Math.max(1, innerH - walkwayWidth * 2);
  const meetH = Math.max(1, Math.floor(availableRightH * 0.375));
  const restH = Math.max(1, Math.floor(availableRightH * 0.375));
  const adminH = Math.max(1, availableRightH - meetH - restH);

  const zones: Zone[] = [];

  zones.push(
    createZone("zone-work-1", "work", {
      x: margin,
      y: margin,
      w: workW,
      h: workH,
    })
  );

  zones.push(
    createZone("zone-walkway-vertical-1", "walkway", {
      x: margin + workW,
      y: margin,
      w: walkwayWidth,
      h: innerH,
    })
  );

  zones.push(
    createZone("zone-meet-1", "meet", {
      x: rightColumnX,
      y: margin,
      w: rightColumnW,
      h: meetH,
    })
  );

  zones.push(
    createZone("zone-walkway-horizontal-1", "walkway", {
      x: rightColumnX,
      y: margin + meetH,
      w: rightColumnW,
      h: walkwayWidth,
    })
  );

  zones.push(
    createZone("zone-rest-1", "rest", {
      x: rightColumnX,
      y: margin + meetH + walkwayWidth,
      w: rightColumnW,
      h: restH,
    })
  );

  zones.push(
    createZone("zone-walkway-horizontal-2", "walkway", {
      x: rightColumnX,
      y: margin + meetH + walkwayWidth + restH,
      w: rightColumnW,
      h: walkwayWidth,
    })
  );

  zones.push(
    createZone("zone-admin-1", "admin", {
      x: rightColumnX,
      y: margin + meetH + walkwayWidth + restH + walkwayWidth,
      w: rightColumnW,
      h: adminH,
    })
  );

  return zones;
};
