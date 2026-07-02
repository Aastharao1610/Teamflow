import type { Response, Request } from "express";
import * as organizationService from "./organization.service";
import type { AuthRequest } from "../../middlewares/auth.middleware";
import type { AcceptInvitationInput } from "./organization.types";
import prisma from "../../lib/prisma";
import { AppError } from "../../utils/AppError";

export const createOrganization = async (req: AuthRequest, res: Response) => {
  try {
    const organization = await organizationService.createOrganization({
      name: req.body.name,
      userId: req.user!.userId,
    });

    res.status(201).json({
      success: true,
      data: organization,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal Server Error";

    res.status(400).json({
      success: false,
      message,
    });
  }
};

export const getMyOrganizations = async (req: AuthRequest, res: Response) => {
  try {
    const organizations = await organizationService.getMyOrganizations(
      req.user!.userId,
    );

    res.status(200).json({
      success: true,
      data: organizations,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal Server Error";

    res.status(500).json({
      success: false,
      message,
    });
  }
};

export const getOrganizationBySlug = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const organization = await organizationService.getOrganizationBySlug(
      req.params.slug,
      req.user!.userId,
    );

    res.status(200).json({
      success: true,
      data: organization,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal Server Error";

    res.status(500).json({
      success: false,
      message,
    });
  }
};

export const updateOrganization = async (req: AuthRequest, res: Response) => {
  try {
    const organization = await organizationService.updateOrganization(
      req.params.slug,
      req.user!.userId,
      req.body,
    );

    res.status(200).json({
      success: true,
      data: organization,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal Server Error";

    res.status(400).json({
      success: false,
      message,
    });
  }
};

export const getorganizationById = async (req: AuthRequest, res: Response) => {
  try {
    const organization = await organizationService.getOrganizationById(
      req.params.id,
      req.user!.userId,
    );

    res.status(200).json({
      success: true,
      data: organization,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal Server Error";

    res.status(500).json({
      success: false,
      message,
    });
  }
};

export const deleteOrganization = async (req: AuthRequest, res: Response) => {
  try {
    await organizationService.deleteOrganization(
      req.params.id,
      req.user!.userId,
    );

    res.status(200).json({
      success: true,
      message: "Organization deleted successfully",
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal Server Error";

    res.status(400).json({
      success: false,
      message,
    });
  }
};

export const inviteMember = async (req: AuthRequest, res: Response) => {
  try {
    const invitation = await organizationService.inviteMember({
      organizationId: req.params.id,
      email: req.body.email,
      invitedById: req.user!.userId,
    });

    res.status(201).json({
      success: true,
      data: invitation,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal Server Error";

    res.status(400).json({
      success: false,
      message,
    });
  }
};

export const acceptInvitation = async (req: AuthRequest, res: Response) => {
  try {
    await organizationService.acceptInvitation({
      token: req.body.token,
      userId: req.user!.userId,
    });

    res.status(200).json({
      success: true,
      message: "Invitation accepted successfully",
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal Server Error";

    res.status(400).json({
      success: false,
      message,
    });
  }
};

export const rejectInvitation = async (req: Request, res: Response) => {
  try {
    await organizationService.rejectInvitation({
      token: req.body.token,
    });

    res.status(200).json({
      success: true,
      message: "Invitation rejected successfully",
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal Server Error";

    res.status(400).json({
      success: false,
      message,
    });
  }
};

export const leaveOrganization = async (req: AuthRequest, res: Response) => {
  try {
    await organizationService.leaveOrganization({
      organizationId: req.params.id,
      userId: req.user!.userId,
    });

    res.status(200).json({
      success: true,
      message: "Left organization successfully",
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal Server Error";

    res.status(400).json({
      success: false,
      message,
    });
  }
};

export const removeMember = async (req: AuthRequest, res: Response) => {
  try {
    await organizationService.removeMember({
      organizationId: req.params.id,
      memberId: req.params.memberId,
      userId: req.user!.userId,
    });

    res.status(200).json({
      success: true,
      message: "Member removed successfully",
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal Server Error";

    res.status(400).json({
      success: false,
      message,
    });
  }
};

export const transferOwnership = async (req: AuthRequest, res: Response) => {
  try {
    await organizationService.transferOwnership({
      organizationId: req.params.id,
      currentOwnerId: req.user!.userId,
      newOwnerId: req.body.newOwnerId,
    });

    res.status(200).json({
      success: true,
      message: "Ownership transferred successfully",
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal Server Error";

    res.status(400).json({
      success: false,
      message,
    });
  }
};
