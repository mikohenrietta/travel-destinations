-- CreateIndex
CREATE INDEX "Country_countryName_idx" ON "Country"("countryName");

-- CreateIndex
CREATE INDEX "Country_continentId_idx" ON "Country"("continentId");

-- CreateIndex
CREATE INDEX "Destination_name_idx" ON "Destination"("name");

-- CreateIndex
CREATE INDEX "Destination_countryId_idx" ON "Destination"("countryId");

-- CreateIndex
CREATE INDEX "Destination_rating_idx" ON "Destination"("rating");
