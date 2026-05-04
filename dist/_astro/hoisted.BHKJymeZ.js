const u="/api/zoning";function c(a){return!a&&a!==0?"—":typeof a=="number"?a.toLocaleString():a}function d(a,t,l,r="green",n="red"){return a?`<span class="pill pill-${r}">${t}</span>`:`<span class="pill pill-${n}">${l}</span>`}function e(a,t){return`<div class="data-row"><span class="data-key">${a}</span><span class="data-val">${t??"—"}</span></div>`}function g(a){const t=a.parcel||{},l=a.zoning||{},r=a.overlays||{},n=a.valuation||{},i=a.development_potential||{},o=a.grants||{};let v=`
      <div class="report-header">
        <div class="report-address">${a.address||a.full_address}</div>
        <div class="report-meta">APN ${t.apn||"—"} &nbsp;·&nbsp; Generated ${a.generated}</div>
      </div>

      <div class="grid-2">

        <!-- Parcel -->
        <div class="card">
          <div class="card-label"><span class="dot"></span>Parcel Data</div>
          ${e("APN",`<code style="font-size:0.85em;color:var(--accent)">${t.apn||"—"}</code>`)}
          ${e("Use Type",t.use_type||"—")}
          ${e("Use Code",t.use_code||"—")}
          ${e("Status",t.status?`<span class="pill pill-green">${t.status}</span>`:"—")}
          ${e("Year Built",t.year_built||"—")}
          ${e("Effective Year",t.effective_year||"—")}
          ${e("Building Sqft",t.sqft_building?c(t.sqft_building)+" sq ft":"—")}
          ${e("Lot Size",t.sqft_lot?c(t.sqft_lot)+" sq ft":"—")}
          ${e("Lot Acres",t.lot_acres||"—")}
          ${e("Dimensions",t.lot_dimensions||"—")}
          ${e("Beds / Baths",t.bedrooms&&t.bathrooms?`${t.bedrooms} / ${t.bathrooms}`:"—")}
          ${e("Units",t.num_units||"1")}
          ${e("Sewer",d(t.sewer,"Connected","Check"))}
          ${e("Corner Lot",d(t.lot_corner,"Yes","No","green","yellow"))}
          ${e("Exemption",t.exemption||"None")}
          ${e("Cluster",t.cluster||"—")}
          ${e("Legal",`<span style="font-size:0.8em;color:var(--muted)">${t.legal_desc||"—"}</span>`)}
        </div>

        <!-- Zoning + Overlays -->
        <div class="card">
          <div class="card-label"><span class="dot"></span>Zoning & Overlays</div>
          ${e("Zone Code",`<code style="font-size:0.9em;color:var(--accent)">${l.code||"—"}</code>`)}
          ${e("Description",l.description||"—")}
          ${e("Multifamily",d(l.multifamily_eligible,"Eligible","Not Eligible"))}
          ${e("Data Source",`<span style="font-size:0.8em;color:var(--muted)">${l.source||"—"}</span>`)}
          <div style="margin: 16px 0 8px; border-top: 1px solid var(--border); padding-top: 14px; font-size:0.72rem; letter-spacing:0.1em; text-transform:uppercase; color:var(--muted);">Overlays</div>
          ${e("TOC Tier",r.toc_tier>0?`<span class="pill pill-green">Tier ${r.toc_tier}</span>`:'<span class="pill pill-yellow">None</span>')}
          ${r.toc_eligible?e("Nearest Metro",`${r.nearest_metro_line} — ${r.distance_to_metro}`):""}
          ${e("AB 2097 Zero Parking",d(r.ab2097_zero_parking,"Exempt","Not Exempt"))}
          ${e("Opportunity Zone",d(r.opportunity_zone,"Yes","No","green","yellow"))}
          ${e("Low Income Area",d(r.low_income_area,"Yes — LMI Tract","No","green","yellow"))}
        </div>

        <!-- Valuation -->
        <div class="card">
          <div class="card-label"><span class="dot"></span>Assessed Value</div>
          <div class="big-stat">$${Math.round((n.total_assessed||0)/1e3)}K</div>
          <div class="big-label">Total assessed (Prop 13)</div>
          <div style="margin-top:20px">
            ${e("Land Value",n.land_value?"$"+c(n.land_value):"—")}
            ${e("Improvement Value",n.improvement_value?"$"+c(n.improvement_value):"—")}
            ${e("Tax Status",n.tax_status?`<span class="pill pill-${n.tax_status==="CURRENT"?"green":"red"}">${n.tax_status}</span>`:"—")}
            ${e("Roll Year",n.roll_year||"—")}
          </div>
          <div style="margin-top:12px;font-size:0.78rem;color:var(--muted);">${n.note||""}</div>
        </div>

        <!-- Development Potential -->
        <div class="card">
          <div class="card-label"><span class="dot"></span>Development Potential</div>
          <div class="units-row">
            <div class="unit-box">
              <div class="num">${i.base_units_by_right??"—"}</div>
              <div class="lbl">By Right</div>
            </div>
            <div class="unit-box">
              <div class="num" style="color:var(--accent)">${i.toc_units||i.base_units_by_right||"—"}</div>
              <div class="lbl">TOC Bonus</div>
            </div>
            <div class="unit-box">
              <div class="num" style="color:var(--accent2)">${i.max_potential_units??"—"}</div>
              <div class="lbl">Max (MIIP)</div>
            </div>
          </div>
          <div style="margin-top:18px">
            ${e("TOC Density Bonus",i.toc_density_bonus||"N/A")}
            ${e("MIIP Available",d(i.miip_available,"Yes — 120% Bonus","No","green","yellow"))}
            ${e("FAR Boost",i.far_boost_available||"N/A")}
            ${e("AB 2097 Zero Parking",d(i.ab2097_zero_parking,"Yes","No","green","yellow"))}
            ${e("Approval Path",i.approval_path||"—")}
          </div>
        </div>

        <!-- Grants -->
        <div class="card card-full">
          <div class="card-label" style="margin-bottom:6px"><span class="dot"></span>Grant Eligibility</div>
          <div style="display:flex;gap:16px;margin-bottom:20px;flex-wrap:wrap">
            <div style="text-align:center;padding:12px 20px;background:rgba(76,175,125,0.08);border:1px solid rgba(76,175,125,0.2);border-radius:10px">
              <div style="font-size:2rem;font-weight:700;color:var(--green)">${o.summary?.total_qualified??0}</div>
              <div style="font-size:0.78rem;color:var(--muted)">Fully Qualified</div>
            </div>
            <div style="text-align:center;padding:12px 20px;background:rgba(232,197,74,0.08);border:1px solid rgba(232,197,74,0.2);border-radius:10px">
              <div style="font-size:2rem;font-weight:700;color:var(--yellow)">${o.summary?.total_potential??0}</div>
              <div style="font-size:0.78rem;color:var(--muted)">Potential</div>
            </div>
            <div style="text-align:center;padding:12px 20px;background:rgba(255,255,255,0.03);border:1px solid var(--border);border-radius:10px">
              <div style="font-size:2rem;font-weight:700;color:var(--muted)">${o.summary?.total_ineligible??0}</div>
              <div style="font-size:0.78rem;color:var(--muted)">Not Eligible</div>
            </div>
          </div>

          ${o.qualified?.length>0?`
            <div style="font-size:0.8rem;letter-spacing:0.08em;text-transform:uppercase;color:var(--green);margin-bottom:12px">
              Fully Qualified (${o.qualified.length})
            </div>
            ${o.qualified.map(s=>`
              <div class="grant-item">
                <div class="grant-top">
                  <div>
                    <div class="grant-name">${s.name}</div>
                    <div class="grant-agency">${s.agency} &nbsp;·&nbsp; <span class="pill pill-${s.level==="federal"?"blue":s.level==="state"?"green":"yellow"}">${s.level}</span></div>
                  </div>
                  <div class="grant-award">${s.max_award}</div>
                </div>
                <div class="grant-desc">${s.description}</div>
                <div class="grant-reasons">
                  ${s.match_reasons?.map(m=>`<span class="reason-tag">✓ ${m}</span>`).join("")||""}
                </div>
                <div style="margin-top:8px;font-size:0.8rem;color:var(--muted)">⏱ ${s.deadline}</div>
                <a href="${s.url}" target="_blank" rel="noopener" class="grant-link">Learn more →</a>
              </div>
            `).join("")}
          `:""}

          ${o.potential?.length>0?`
            <div style="font-size:0.8rem;letter-spacing:0.08em;text-transform:uppercase;color:var(--yellow);margin: 24px 0 12px">
              Worth Exploring (${o.potential.length})
            </div>
            ${o.potential.map(s=>`
              <div class="grant-item" style="opacity:0.75">
                <div class="grant-top">
                  <div class="grant-name">${s.name}</div>
                  <div class="grant-award">${s.max_award}</div>
                </div>
                <div class="grant-agency">${s.agency}</div>
                <a href="${s.url}" target="_blank" rel="noopener" class="grant-link">Learn more →</a>
              </div>
            `).join("")}
          `:""}
        </div>

      </div>

      <div class="sources">
        <strong>Data Sources:</strong><br>
        ${a.data_sources?.join(" &nbsp;·&nbsp; ")||""}
        <br><br>
        <strong>Disclaimer:</strong> This report is for informational purposes only. Verify zoning with
        <a href="https://zimas.lacity.org" target="_blank" style="color:var(--accent2)">ZIMAS</a>,
        assessed values with <a href="https://portal.assessor.lacounty.gov" target="_blank" style="color:var(--accent2)">LA County Assessor</a>,
        and grant eligibility with the issuing agency before making investment decisions.
      </div>
    `;document.getElementById("report").innerHTML=v,document.getElementById("report").style.display="block"}async function p(){const a=document.getElementById("address-input").value.trim();if(a){document.getElementById("loading").style.display="block",document.getElementById("report").style.display="none",document.getElementById("error-box").style.display="none",document.getElementById("search-btn").disabled=!0,document.getElementById("search-btn").textContent="Searching…";try{const l=await(await fetch(u,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({address:a})})).json();l.error?(document.getElementById("error-box").textContent=l.error,document.getElementById("error-box").style.display="block"):(g(l),document.getElementById("report").scrollIntoView({behavior:"smooth",block:"start"}))}catch{document.getElementById("error-box").textContent="Could not reach the server. Please try again in a moment.",document.getElementById("error-box").style.display="block"}finally{document.getElementById("loading").style.display="none",document.getElementById("search-btn").disabled=!1,document.getElementById("search-btn").textContent="Run Report"}}}document.getElementById("search-btn").addEventListener("click",p);document.getElementById("address-input").addEventListener("keydown",a=>{a.key==="Enter"&&p()});
