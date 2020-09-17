SELECT zft_temp.p_id, ROUND(SUM(zft_temp.a_score_new)) as zts, zp.p_title
FROM `zft_temp` JOIN zft_program zp on
    zft_temp.p_id = zp.p_id WHERE `zft_temp`.ati_id in (88,77,66)GROUP BY p_id ORDER BY zts DESC;